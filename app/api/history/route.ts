import { jwtVerify } from "jose";
import type { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type SessionPayload = {
	parentId: number;
};

type HistoryRow = RowDataPacket & {
	search_history_id: number;
	search_query: string;
	created_at: Date;
	child_id: number;
	first_name: string;
	avatar_url: string | null;
};

function getSecretKey() {
	const secret = process.env.AUTH_SECRET;

	if (!secret) {
		throw new Error("AUTH_SECRET est absent de .env.local.");
	}

	return new TextEncoder().encode(secret);
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

		const { payload } = await jwtVerify(
			token,
			getSecretKey(),
		);

		const { parentId } = payload as SessionPayload;

		const [history] = await db.query<HistoryRow[]>(
			`
				SELECT
					search_history.search_history_id,
					search_history.search_query,
					search_history.created_at,
					child.child_id,
					child.first_name,
					child.avatar_url
				FROM search_history
				INNER JOIN child
					ON child.child_id = search_history.child_id
				WHERE child.parent_id = ?
				ORDER BY search_history.created_at DESC
			`,
			[parentId],
		);

		return NextResponse.json({
			history,
		});
	} catch (error) {
		console.error("GET /api/history :", error);

		return NextResponse.json(
			{
				message:
					"Impossible de récupérer l’historique.",
			},
			{ status: 500 },
		);
	}
}