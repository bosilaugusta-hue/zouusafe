import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type SessionPayload = {
	parentId: number;
};

type PasswordBody = {
	currentPassword?: string;
	newPassword?: string;
	confirmPassword?: string;
};

type ParentPasswordRow = RowDataPacket & {
	password: string;
};

function getSecretKey() {
	const secret = process.env.AUTH_SECRET;

	if (!secret) {
		throw new Error("AUTH_SECRET est absent de .env.local.");
	}

	return new TextEncoder().encode(secret);
}

export async function PATCH(request: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("zouusafe_session")?.value;

		if (!token) {
			return NextResponse.json(
				{
					message: "Vous devez être connecté.",
				},
				{
					status: 401,
				},
			);
		}

		const { payload } = await jwtVerify(token, getSecretKey());
		const session = payload as SessionPayload;
		const parentId = session.parentId;

		if (!parentId) {
			return NextResponse.json(
				{
					message: "Session invalide.",
				},
				{
					status: 401,
				},
			);
		}

		const body = (await request.json()) as PasswordBody;

		const currentPassword = body.currentPassword ?? "";
		const newPassword = body.newPassword ?? "";
		const confirmPassword = body.confirmPassword ?? "";

		if (!currentPassword || !newPassword || !confirmPassword) {
			return NextResponse.json(
				{
					message: "Veuillez remplir tous les champs.",
				},
				{
					status: 400,
				},
			);
		}

		if (newPassword.length < 12) {
			return NextResponse.json(
				{
					message:
						"Le nouveau mot de passe doit contenir au moins 12 caractères.",
				},
				{
					status: 400,
				},
			);
		}

		if (newPassword !== confirmPassword) {
			return NextResponse.json(
				{
					message:
						"Les deux nouveaux mots de passe ne correspondent pas.",
				},
				{
					status: 400,
				},
			);
		}

		if (currentPassword === newPassword) {
			return NextResponse.json(
				{
					message:
						"Le nouveau mot de passe doit être différent de l’ancien.",
				},
				{
					status: 400,
				},
			);
		}

		const [parents] = await db.execute<ParentPasswordRow[]>(
			`
				SELECT password
				FROM parent
				WHERE parent_id = ?
				LIMIT 1
			`,
			[parentId],
		);

		const parent = parents[0];

		if (!parent) {
			return NextResponse.json(
				{
					message: "Parent introuvable.",
				},
				{
					status: 404,
				},
			);
		}

		const currentPasswordIsValid = await bcrypt.compare(
			currentPassword,
			parent.password,
		);

		if (!currentPasswordIsValid) {
			return NextResponse.json(
				{
					message: "Le mot de passe actuel est incorrect.",
				},
				{
					status: 401,
				},
			);
		}

		const hashedPassword = await bcrypt.hash(newPassword, 12);

		const [result] = await db.execute<ResultSetHeader>(
			`
				UPDATE parent
				SET password = ?
				WHERE parent_id = ?
			`,
			[hashedPassword, parentId],
		);

		if (result.affectedRows !== 1) {
			return NextResponse.json(
				{
					message: "Le mot de passe n’a pas pu être modifié.",
				},
				{
					status: 500,
				},
			);
		}

		return NextResponse.json({
			message: "Votre mot de passe a été modifié avec succès.",
		});
	} catch (error) {
		console.error(
			"Erreur lors de la modification du mot de passe :",
			error,
		);

		return NextResponse.json(
			{
				message:
					"Une erreur est survenue pendant la modification du mot de passe.",
			},
			{
				status: 500,
			},
		);
	}
}