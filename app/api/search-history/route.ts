import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type SearchHistoryBody = {
	childId?: number;
	query?: string;
};

type SearchHistoryRow = RowDataPacket & {
	search_history_id: number;
	search_query: string;
	created_at: string;
	child_id: number;
	child_name: string;
};

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as SearchHistoryBody;

		const childId = Number(body.childId);
		const query = body.query?.trim();

		if (!childId || !query) {
			return NextResponse.json(
				{
					error: "Paramètres invalides.",
				},
				{ status: 400 },
			);
		}

		await db.execute(
			`
				INSERT INTO search_history (
					child_id,
					search_query
				)
				VALUES (?, ?)
			`,
			[childId, query],
		);

		return NextResponse.json(
			{
				success: true,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Erreur pendant l'enregistrement de l'historique :", error);

		return NextResponse.json(
			{
				error: "Erreur serveur.",
			},
			{ status: 500 },
		);
	}
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);

		const childId = Number(searchParams.get("childId"));

		if (!childId) {
			return NextResponse.json(
				{
					error: "L'identifiant de l'enfant est obligatoire.",
				},
				{ status: 400 },
			);
		}

		const [rows] = await db.execute<SearchHistoryRow[]>(
			`
				SELECT
					sh.search_history_id,
					sh.search_query,
					sh.created_at,
					sh.child_id,
					c.first_name AS child_name
				FROM search_history AS sh
				INNER JOIN child AS c
					ON c.child_id = sh.child_id
				WHERE sh.child_id = ?
				ORDER BY sh.created_at DESC
				LIMIT 50
			`,
			[childId],
		);

		return NextResponse.json({
			history: rows,
		});
	} catch (error) {
		console.error("Erreur pendant la récupération de l'historique :", error);

		return NextResponse.json(
			{
				error: "Impossible de récupérer l'historique.",
			},
			{ status: 500 },
		);
	}
}
