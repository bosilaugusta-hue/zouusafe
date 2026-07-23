import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type SessionPayload = {
	parentId: number;
};

type PinBody = {
	pin?: string;
};

function getSecretKey() {
	const secret = process.env.AUTH_SECRET;

	if (!secret) {
		throw new Error(
			"La variable AUTH_SECRET est introuvable.",
		);
	}

	return new TextEncoder().encode(secret);
}

export async function POST(request: Request) {
	try {
		const cookieStore = await cookies();
		const sessionCookie =
			cookieStore.get("zouusafe_session");

		if (!sessionCookie) {
			return NextResponse.json(
				{
					message:
						"Vous devez être connecté pour créer un code PIN.",
				},
				{ status: 401 },
			);
		}

		const { payload } = await jwtVerify(
			sessionCookie.value,
			getSecretKey(),
		);

		const session = payload as unknown as SessionPayload;

		if (!session.parentId) {
			return NextResponse.json(
				{
					message: "Session parent invalide.",
				},
				{ status: 401 },
			);
		}

		const body = (await request.json()) as PinBody;
		const pin = body.pin?.trim();

		if (!pin || !/^\d{4}$/.test(pin)) {
			return NextResponse.json(
				{
					message:
						"Le code PIN doit contenir exactement 4 chiffres.",
				},
				{ status: 400 },
			);
		}

		const hashedPin = await bcrypt.hash(pin, 10);

		await db.execute(
			`
				UPDATE parent
				SET pin_code = ?
				WHERE parent_id = ?
			`,
			[hashedPin, session.parentId],
		);

		return NextResponse.json(
			{
				message:
					"Le code PIN a bien été enregistré.",
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"Erreur pendant l’enregistrement du PIN :",
			error,
		);

		return NextResponse.json(
			{
				message:
					"Impossible d’enregistrer le code PIN.",
			},
			{ status: 500 },
		);
	}
}