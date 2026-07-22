import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { RowDataPacket } from "mysql2";

import { db } from "@/lib/db";

type SessionPayload = {
	parentId: number;
};

type SettingRow = RowDataPacket & {
	child_id: number;
	first_name: string;
	screen_time_limit: number;
	screen_time_used: number;
	filter_level: string;
	safe_search: boolean;
};

function getSecretKey() {
	const secret = process.env.AUTH_SECRET;

	if (!secret) {
		throw new Error("AUTH_SECRET absent.");
	}

	return new TextEncoder().encode(secret);
}

export async function GET() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("zouusafe_session")?.value;

		if (!token) {
			return NextResponse.json(
				{ message: "Non connecté." },
				{ status: 401 },
			);
		}

		const { payload } = await jwtVerify(
			token,
			getSecretKey(),
		);

		const { parentId } = payload as SessionPayload;

		const [settings] = await db.query<SettingRow[]>(
			`
			SELECT
				child.child_id,
				child.first_name,
				safety_setting.screen_time_limit,
				safety_setting.screen_time_used,
				safety_setting.filter_level,
				safety_setting.safe_search
			FROM child
			INNER JOIN safety_setting
				ON child.child_id=safety_setting.child_id
			WHERE child.parent_id=?
			ORDER BY child.first_name
			`,
			[parentId],
		);

		return NextResponse.json({
			settings,
		});
	} catch (error) {
		console.error(error);

		return NextResponse.json(
			{ message: "Erreur serveur." },
			{ status: 500 },
		);
	}
}