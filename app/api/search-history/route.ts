import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type SearchBody = {
	childId?: number;
	query?: string;
};

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as SearchBody;

		const childId = body.childId;
		const query = body.query?.trim();

		if (!childId || !query) {
			return NextResponse.json(
				{ message: "Données invalides." },
				{ status: 400 },
			);
		}

		await db.execute(
			`
				INSERT INTO search_history (
					search_query,
					child_id
				)
				VALUES (?, ?)
			`,
			[query, childId],
		);

		return NextResponse.json({
			success: true,
		});
	} catch (error) {
		console.error(error);

		return NextResponse.json(
			{ message: "Erreur serveur." },
			{ status: 500 },
		);
	}
}