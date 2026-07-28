import { jwtVerify } from "jose";
import type { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type SessionPayload = {
	parentId: number;
};

type BlockedContentRow = RowDataPacket & {
	blocked_content_id: number;
	content_name: string;
	reason: string;
	blocked_at: Date;
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

		const { payload } = await jwtVerify(token, getSecretKey());

		const { parentId } = payload as SessionPayload;

		const [blockedSites] = await db.query<BlockedContentRow[]>(
			`
				SELECT
					blocked_content.blocked_content_id,
					blocked_content.content_name,
					blocked_content.reason,
					blocked_content.blocked_at,
					child.child_id,
					child.first_name,
					child.avatar_url
				FROM blocked_content
				INNER JOIN child
					ON child.child_id = blocked_content.child_id
				WHERE child.parent_id = ?
				ORDER BY blocked_content.blocked_at DESC
			`,
			[parentId],
		);

		return NextResponse.json({
			blockedSites,
		});
	} catch (error) {
		console.error("GET /api/blocked :", error);

		return NextResponse.json(
			{
				message: "Impossible de récupérer les sites bloqués.",
			},
			{ status: 500 },
		);
	}
}
