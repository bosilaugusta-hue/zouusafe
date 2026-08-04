import { jwtVerify } from "jose";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type SessionPayload = {
	parentId: number;
};

type ProfileBody = {
	firstName?: string;
	lastName?: string;
	email?: string;
};

type ExistingEmailRow = RowDataPacket & {
	parent_id: number;
};

function getSecretKey() {
	const secret = process.env.AUTH_SECRET;

	if (!secret) {
		throw new Error("AUTH_SECRET est absent de .env.local.");
	}

	return new TextEncoder().encode(secret);
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

		const body = (await request.json()) as ProfileBody;

		const firstName = body.firstName?.trim() ?? "";
		const lastName = body.lastName?.trim() ?? "";
		const email = body.email?.trim().toLowerCase() ?? "";

		if (!firstName) {
			return NextResponse.json(
				{
					message: "Le prénom est obligatoire.",
				},
				{
					status: 400,
				},
			);
		}

		if (firstName.length > 100) {
			return NextResponse.json(
				{
					message: "Le prénom ne doit pas dépasser 100 caractères.",
				},
				{
					status: 400,
				},
			);
		}

		if (lastName.length > 100) {
			return NextResponse.json(
				{
					message: "Le nom ne doit pas dépasser 100 caractères.",
				},
				{
					status: 400,
				},
			);
		}

		if (!email) {
			return NextResponse.json(
				{
					message: "L’adresse e-mail est obligatoire.",
				},
				{
					status: 400,
				},
			);
		}

		if (!isValidEmail(email)) {
			return NextResponse.json(
				{
					message: "L’adresse e-mail n’est pas valide.",
				},
				{
					status: 400,
				},
			);
		}

		if (email.length > 255) {
			return NextResponse.json(
				{
					message: "L’adresse e-mail est trop longue.",
				},
				{
					status: 400,
				},
			);
		}

		const [existingParents] = await db.query<ExistingEmailRow[]>(
			`
				SELECT parent_id
				FROM parent
				WHERE email = ?
					AND parent_id <> ?
				LIMIT 1
			`,
			[email, parentId],
		);

		if (existingParents.length > 0) {
			return NextResponse.json(
				{
					message: "Cette adresse e-mail est déjà utilisée.",
				},
				{
					status: 409,
				},
			);
		}

		const [result] = await db.execute<ResultSetHeader>(
			`
				UPDATE parent
				SET
					first_name = ?,
					last_name = ?,
					email = ?
				WHERE parent_id = ?
			`,
			[firstName, lastName, email, parentId],
		);

		if (result.affectedRows === 0) {
			return NextResponse.json(
				{
					message: "Parent introuvable.",
				},
				{
					status: 404,
				},
			);
		}

		return NextResponse.json({
			message: "Vos informations ont été mises à jour.",
			parent: {
				firstName,
				lastName,
				email,
			},
		});
	} catch (error) {
		console.error("Erreur lors de la modification du profil :", error);

		return NextResponse.json(
			{
				message: "Une erreur est survenue pendant la modification.",
			},
			{
				status: 500,
			},
		);
	}
}