import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type SessionPayload = {
	parentId: number;
};

type VerifyPinBody = {
	pin?: string;
};

type ParentRow = RowDataPacket & {
	parent_id: number;
	pin_code: string | null;
};

function getSecretKey() {
	const secret = process.env.AUTH_SECRET;

	if (!secret) {
		throw new Error("AUTH_SECRET est absente de .env.local.");
	}

	return new TextEncoder().encode(secret);
}

export async function POST(request: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("zouusafe_session")?.value;

		if (!token) {
			return NextResponse.json(
				{
					message: "Vous devez être connecté.",
				},
				{ status: 401 },
			);
		}

		const { payload } = await jwtVerify(
			token,
			getSecretKey(),
		);

		const { parentId } = payload as SessionPayload;

		if (!parentId) {
			return NextResponse.json(
				{
					message: "Session parent invalide.",
				},
				{ status: 401 },
			);
		}

		const body = (await request.json()) as VerifyPinBody;
		const pin = body.pin?.trim();

		if (!pin) {
			return NextResponse.json(
				{
					message: "Le code PIN est obligatoire.",
				},
				{ status: 400 },
			);
		}

		if (!/^\d{4}$/.test(pin)) {
			return NextResponse.json(
				{
					message:
						"Le code PIN doit contenir exactement 4 chiffres.",
				},
				{ status: 400 },
			);
		}

		const [parents] = await db.execute<ParentRow[]>(
			`
				SELECT
					parent_id,
					pin_code
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
					message: "Le compte parent est introuvable.",
				},
				{ status: 404 },
			);
		}

		if (!parent.pin_code) {
			return NextResponse.json(
				{
					message:
						"Aucun code PIN n’a encore été configuré.",
					requiresPinSetup: true,
				},
				{ status: 409 },
			);
		}

		const isValidPin = await bcrypt.compare(
			pin,
			parent.pin_code,
		);

		if (!isValidPin) {
			return NextResponse.json(
				{
					message: "Le code PIN est incorrect.",
				},
				{ status: 401 },
			);
		}

		return NextResponse.json({
			valid: true,
			message: "Code PIN validé.",
		});
	} catch (error) {
		console.error(
			"Erreur pendant la vérification du PIN :",
			error,
		);

		return NextResponse.json(
			{
				message:
					"Une erreur est survenue pendant la vérification du PIN.",
			},
			{ status: 500 },
		);
	}
}