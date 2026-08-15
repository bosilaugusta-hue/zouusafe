import { jwtVerify } from "jose";
import type { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type SessionPayload = {
	parentId: number;
};

type AlertRow = RowDataPacket & {
	alert_id: number;
	message: string;
	severity: string;
	created_at: string;
	child_name: string;
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
				{ message: "Non authentifié." },
				{ status: 401 },
			);
		}

		const { payload } = await jwtVerify(token, getSecretKey());
		const session = payload as SessionPayload;

		if (!session.parentId) {
			return NextResponse.json(
				{ message: "Session invalide." },
				{ status: 401 },
			);
		}

		const [alerts] = await db.query<AlertRow[]>(
			`
				SELECT
					alert.alert_id,
					alert.message,
					alert.severity,
					alert.created_at,
					child.first_name AS child_name
				FROM alert
				INNER JOIN child
					ON alert.child_id = child.child_id
				WHERE child.parent_id = ?
				ORDER BY alert.created_at DESC
			`,
			[session.parentId],
		);

		return NextResponse.json({ alerts });
	} catch (error) {
		console.error("Erreur alertes :", error);

		return NextResponse.json(
			{ message: "Impossible de récupérer les alertes." },
			{ status: 500 },
		);
	}
}