import { jwtVerify } from "jose";
import type { ResultSetHeader } from "mysql2";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type SessionPayload = {
	parentId: number;
};

type CreateChildBody = {
	firstName?: string;
	birthDate?: string;
	gender?: string;
	avatar?: string;
};

function getSecretKey() {
	const secret = process.env.AUTH_SECRET;

	if (!secret) {
		throw new Error("AUTH_SECRET est absent de .env.local.");
	}

	return new TextEncoder().encode(secret);
}

export async function POST(request: Request) {
	const connection = await db.getConnection();
	let transactionStarted = false;

	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("zouusafe_session")?.value;

		if (!token) {
			return NextResponse.json(
				{ message: "Vous devez être connecté." },
				{ status: 401 },
			);
		}

		const { payload } = await jwtVerify(token, getSecretKey());
		const { parentId } = payload as SessionPayload;

		if (!parentId) {
			return NextResponse.json(
				{ message: "Session invalide." },
				{ status: 401 },
			);
		}

		const body = (await request.json()) as CreateChildBody;

		const firstName = body.firstName?.trim();
		const birthDate = body.birthDate?.trim();
		const gender = body.gender?.trim();
		const avatar =
			body.avatar?.trim() || "/avatars-profil/fille-1.png";

		if (!firstName || !birthDate || !gender) {
			return NextResponse.json(
				{
					message:
						"Le prénom, la date de naissance et le genre sont obligatoires.",
				},
				{ status: 400 },
			);
		}

		if (!["female", "male", "other"].includes(gender)) {
			return NextResponse.json(
				{ message: "Le genre sélectionné est invalide." },
				{ status: 400 },
			);
		}

		if (firstName.length > 100) {
			return NextResponse.json(
				{
					message: "Le prénom ne peut pas dépasser 100 caractères.",
				},
				{ status: 400 },
			);
		}

		const parsedBirthDate = new Date(`${birthDate}T00:00:00`);
		const today = new Date();

		if (
			Number.isNaN(parsedBirthDate.getTime()) ||
			parsedBirthDate > today
		) {
			return NextResponse.json(
				{ message: "La date de naissance est invalide." },
				{ status: 400 },
			);
		}

		await connection.beginTransaction();
		transactionStarted = true;

		const [childResult] =
			await connection.execute<ResultSetHeader>(
				`
					INSERT INTO child (
						first_name,
						birth_date,
						avatar_url,
						parent_id,
						gender
					)
					VALUES (?, ?, ?, ?, ?)
				`,
				[firstName, birthDate, avatar, parentId, gender],
			);

		const childId = childResult.insertId;

		await connection.execute<ResultSetHeader>(
			`
				INSERT INTO safety_setting (
					screen_time_limit,
					screen_time_used,
					filter_level,
					safe_search,
					child_id
				)
				VALUES (?, ?, ?, ?, ?)
			`,
			[120, 0, "standard", true, childId],
		);

		await connection.commit();
		transactionStarted = false;

		return NextResponse.json(
			{
				success: true,
				message: "Le profil de l’enfant a été créé.",
				child: {
					childId,
					firstName,
					birthDate,
					gender,
					avatar,
				},
			},
			{ status: 201 },
		);
	} catch (error) {
		if (transactionStarted) {
			await connection.rollback();
		}

		console.error("Erreur création enfant :", error);

		return NextResponse.json(
			{
				message:
					"Une erreur est survenue pendant la création du profil.",
			},
			{ status: 500 },
		);
	} finally {
		connection.release();
	}
}

export async function GET() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("zouusafe_session")?.value;

		if (!token) {
			return NextResponse.json(
				{ message: "Vous devez être connecté." },
				{ status: 401 },
			);
		}

		const { payload } = await jwtVerify(token, getSecretKey());
		const { parentId } = payload as SessionPayload;

		const [children] = await db.execute(
			`
				SELECT
					c.child_id,
					c.first_name,
					c.birth_date,
					c.avatar_url,
					c.gender,
					s.screen_time_limit,
					s.screen_time_used,
					s.filter_level
				FROM child c
				LEFT JOIN safety_setting s
					ON s.child_id = c.child_id
				WHERE c.parent_id = ?
				ORDER BY c.first_name
			`,
			[parentId],
		);

		return NextResponse.json({
			children,
		});
	} catch (error) {
		console.error(error);

		return NextResponse.json(
			{ message: "Erreur serveur." },
			{ status: 500 },
		);
	}
}