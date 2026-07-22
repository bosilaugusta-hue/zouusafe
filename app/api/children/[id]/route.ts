import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type RouteContext = {
	params: Promise<{
		id: string;
	}>;
};

type ChildRow = RowDataPacket & {
	child_id: number;
	first_name: string;
	birth_date: string;
	gender: string;
	avatar_url: string;
	parent_id: number;
};

type UpdateChildBody = {
	firstName?: string;
	birthDate?: string;
	gender?: string;
	avatarUrl?: string;
};

const allowedGenders = ["girl", "boy", "other"];

export async function GET(
	_request: Request,
	{ params }: RouteContext,
) {
	try {
		const { id } = await params;
		const childId = Number(id);

		if (!Number.isInteger(childId) || childId <= 0) {
			return NextResponse.json(
				{ message: "Identifiant invalide." },
				{ status: 400 },
			);
		}

		const [children] = await db.query<ChildRow[]>(
			`
				SELECT
					child_id,
					first_name,
					birth_date,
					gender,
					avatar_url,
					parent_id
				FROM child
				WHERE child_id = ?
				LIMIT 1
			`,
			[childId],
		);

		const child = children[0];

		if (!child) {
			return NextResponse.json(
				{ message: "Enfant introuvable." },
				{ status: 404 },
			);
		}

		return NextResponse.json({ child });
	} catch (error) {
		console.error("GET /api/children/[id] :", error);

		return NextResponse.json(
			{ message: "Impossible de récupérer l’enfant." },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	request: Request,
	{ params }: RouteContext,
) {
	try {
		const { id } = await params;
		const childId = Number(id);

		if (!Number.isInteger(childId) || childId <= 0) {
			return NextResponse.json(
				{ message: "Identifiant invalide." },
				{ status: 400 },
			);
		}

		const body = (await request.json()) as UpdateChildBody;

		const firstName = body.firstName?.trim();
		const birthDate = body.birthDate?.trim();
		const gender = body.gender?.trim();
		const avatarUrl = body.avatarUrl?.trim();

		if (!firstName || !birthDate || !gender || !avatarUrl) {
			return NextResponse.json(
				{
					message:
						"Le prénom, la date de naissance, le genre et l’avatar sont obligatoires.",
				},
				{ status: 400 },
			);
		}

		if (!allowedGenders.includes(gender)) {
			return NextResponse.json(
				{ message: "Le genre sélectionné est invalide." },
				{ status: 400 },
			);
		}

		const [result] = await db.execute<ResultSetHeader>(
			`
				UPDATE child
				SET
					first_name = ?,
					birth_date = ?,
					gender = ?,
					avatar_url = ?
				WHERE child_id = ?
			`,
			[firstName, birthDate, gender, avatarUrl, childId],
		);

		if (result.affectedRows === 0) {
			return NextResponse.json(
				{ message: "Enfant introuvable." },
				{ status: 404 },
			);
		}

		const [children] = await db.query<ChildRow[]>(
			`
				SELECT
					child_id,
					first_name,
					birth_date,
					gender,
					avatar_url,
					parent_id
				FROM child
				WHERE child_id = ?
				LIMIT 1
			`,
			[childId],
		);

		return NextResponse.json({
			message: "Le profil a bien été modifié.",
			child: children[0],
		});
	} catch (error) {
		console.error("PATCH /api/children/[id] :", error);

		return NextResponse.json(
			{ message: "Impossible de modifier le profil." },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_request: Request,
	{ params }: RouteContext,
) {
	const connection = await db.getConnection();

	try {
		const { id } = await params;
		const childId = Number(id);

		if (!Number.isInteger(childId) || childId <= 0) {
			return NextResponse.json(
				{ message: "Identifiant invalide." },
				{ status: 400 },
			);
		}

		await connection.beginTransaction();


		await connection.execute(
			`
				DELETE FROM search_history
				WHERE child_id = ?
			`,
			[childId],
		);

		await connection.execute(
			`
				DELETE FROM blocked_content
				WHERE child_id = ?
			`,
			[childId],
		);

		await connection.execute(
			`
				DELETE FROM safety_setting
				WHERE child_id = ?
			`,
			[childId],
		);

		const [result] = await connection.execute<ResultSetHeader>(
			`
				DELETE FROM child
				WHERE child_id = ?
			`,
			[childId],
		);

		if (result.affectedRows === 0) {
			await connection.rollback();

			return NextResponse.json(
				{ message: "Enfant introuvable." },
				{ status: 404 },
			);
		}

		await connection.commit();

		return NextResponse.json({
			message: "Le profil enfant a bien été supprimé.",
		});
	} catch (error) {
		await connection.rollback();

		console.error("DELETE /api/children/[id] :", error);

		return NextResponse.json(
			{
				message:
					"Impossible de supprimer ce profil et ses données associées.",
			},
			{ status: 500 },
		);
	} finally {
		connection.release();
	}
}