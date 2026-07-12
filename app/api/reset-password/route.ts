import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type ResetPasswordBody = {
	token?: string;
	password?: string;
	confirmPassword?: string;
};

type ResetTokenRow = RowDataPacket & {
	password_reset_token_id: number;
	parent_id: number;
	expires_at: Date;
	used_at: Date | null;
};

export async function POST(request: Request) {
	const connection = await db.getConnection();

	try {
		const body = (await request.json()) as ResetPasswordBody;

		const token = body.token?.trim();
		const password = body.password ?? "";
		const confirmPassword = body.confirmPassword ?? "";

		if (!token || !password || !confirmPassword) {
			return NextResponse.json(
				{
					message: "Tous les champs sont obligatoires.",
				},
				{
					status: 400,
				},
			);
		}

		if (password.length < 12) {
			return NextResponse.json(
				{
					message:
						"Le mot de passe doit contenir au moins 12 caractères.",
				},
				{
					status: 400,
				},
			);
		}

		if (password !== confirmPassword) {
			return NextResponse.json(
				{
					message: "Les deux mots de passe ne correspondent pas.",
				},
				{
					status: 400,
				},
			);
		}

		const tokenHash = createHash("sha256")
			.update(token)
			.digest("hex");

		await connection.beginTransaction();

		const [tokenRows] = await connection.execute<ResetTokenRow[]>(
			`
				SELECT
					password_reset_token_id,
					parent_id,
					expires_at,
					used_at
				FROM password_reset_token
				WHERE token_hash = ?
				LIMIT 1
				FOR UPDATE
			`,
			[tokenHash],
		);

		const resetToken = tokenRows[0];

		if (!resetToken) {
			await connection.rollback();

			return NextResponse.json(
				{
					message:
						"Ce lien de réinitialisation est invalide.",
				},
				{
					status: 400,
				},
			);
		}

		if (resetToken.used_at) {
			await connection.rollback();

			return NextResponse.json(
				{
					message:
						"Ce lien de réinitialisation a déjà été utilisé.",
				},
				{
					status: 400,
				},
			);
		}

		const expirationDate = new Date(resetToken.expires_at);

		if (expirationDate.getTime() < Date.now()) {
			await connection.rollback();

			return NextResponse.json(
				{
					message:
						"Ce lien de réinitialisation a expiré. Demandez-en un nouveau.",
				},
				{
					status: 400,
				},
			);
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const [updateParentResult] =
			await connection.execute<ResultSetHeader>(
				`
					UPDATE parent
					SET password = ?
					WHERE parent_id = ?
				`,
				[hashedPassword, resetToken.parent_id],
			);

		if (updateParentResult.affectedRows !== 1) {
			throw new Error(
				"Le compte parent associé au jeton est introuvable.",
			);
		}

		await connection.execute<ResultSetHeader>(
			`
				UPDATE password_reset_token
				SET used_at = NOW()
				WHERE password_reset_token_id = ?
			`,
			[resetToken.password_reset_token_id],
		);

		await connection.execute<ResultSetHeader>(
			`
				UPDATE password_reset_token
				SET used_at = NOW()
				WHERE parent_id = ?
					AND used_at IS NULL
					AND password_reset_token_id <> ?
			`,
			[
				resetToken.parent_id,
				resetToken.password_reset_token_id,
			],
		);

		await connection.commit();

		return NextResponse.json({
			success: true,
			message:
				"Votre mot de passe a été modifié avec succès.",
		});
	} catch (error) {
		await connection.rollback();

		console.error(
			"Erreur de réinitialisation du mot de passe :",
			error,
		);

		return NextResponse.json(
			{
				message:
					"Une erreur est survenue pendant la réinitialisation.",
			},
			{
				status: 500,
			},
		);
	} finally {
		connection.release();
	}
}