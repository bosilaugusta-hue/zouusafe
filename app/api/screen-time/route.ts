import { jwtVerify } from "jose";
import type { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type SessionPayload = {
	parentId: number;
};

type ScreenTimeRow = RowDataPacket & {
	child_id: number;
	first_name: string;
	avatar_url: string | null;
	screen_time_limit: number;
	screen_time_used: number;
	filter_level: string;
	safe_search: boolean;
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

		const [children] = await db.query<ScreenTimeRow[]>(
			`
				SELECT
					child.child_id,
					child.first_name,
					child.avatar_url,
					safety_setting.screen_time_limit,
					safety_setting.screen_time_used,
					safety_setting.filter_level,
					safety_setting.safe_search
				FROM child
				LEFT JOIN safety_setting
					ON safety_setting.child_id = child.child_id
				WHERE child.parent_id = ?
				ORDER BY child.first_name
			`,
			[parentId],
		);

		return NextResponse.json({
			children,
		});
	} catch (error) {
		console.error("GET /api/screen-time :", error);

		return NextResponse.json(
			{
				message:
					"Impossible de récupérer les données de temps d’écran.",
			},
			{ status: 500 },
		);
	}
}