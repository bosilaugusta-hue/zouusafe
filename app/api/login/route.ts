import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type LoginBody = {
	email?: string;
	password?: string;
};

type ParentRow = RowDataPacket & {
	parent_id: number;
	first_name: string;
	email: string;
	password: string;
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

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as LoginBody;

		const email = body.email?.trim().toLowerCase() ?? "";
		const password = body.password ?? "";

		if (!email || !password) {
			return NextResponse.json(
				{
					message:
						"L’adresse e-mail et le mot de passe sont obligatoires.",
				},
				{
					status: 400,
				},
			);
		}

		if (!isValidEmail(email) || email.length > 255) {
			return NextResponse.json(
				{
					message: "Adresse e-mail ou mot de passe incorrect.",
				},
				{
					status: 401,
				},
			);
		}

		if (password.length > 255) {
			return NextResponse.json(
				{
					message: "Adresse e-mail ou mot de passe incorrect.",
				},
				{
					status: 401,
				},
			);
		}

		const [parents] = await db.execute<ParentRow[]>(
			`
				SELECT
					parent_id,
					first_name,
					email,
					password
				FROM parent
				WHERE email = ?
				LIMIT 1
			`,
			[email],
		);

		const parent = parents[0];

		if (!parent) {
			return NextResponse.json(
				{
					message: "Adresse e-mail ou mot de passe incorrect.",
				},
				{
					status: 401,
				},
			);
		}

		const passwordIsValid = await bcrypt.compare(
			password,
			parent.password,
		);

		if (!passwordIsValid) {
			return NextResponse.json(
				{
					message: "Adresse e-mail ou mot de passe incorrect.",
				},
				{
					status: 401,
				},
			);
		}

		const token = await new SignJWT({
			parentId: parent.parent_id,
			firstName: parent.first_name,
		})
			.setProtectedHeader({
				alg: "HS256",
			})
			.setIssuedAt()
			.setExpirationTime("7d")
			.sign(getSecretKey());

		const response = NextResponse.json({
			success: true,
			parentId: parent.parent_id,
			firstName: parent.first_name,
			message: "Connexion réussie.",
		});

		response.cookies.set({
			name: "zouusafe_session",
			value: token,
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});

		return response;
	} catch (error) {
		console.error("Erreur de connexion :", error);

		return NextResponse.json(
			{
				message: "Une erreur est survenue pendant la connexion.",
			},
			{
				status: 500,
			},
		);
	}
}