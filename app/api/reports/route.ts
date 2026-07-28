import { jwtVerify } from "jose";
import type { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type SessionPayload = {
	parentId: number;
};

type CountRow = RowDataPacket & {
	total: number;
};

type ScreenTimeRow = RowDataPacket & {
	total_used: number;
	total_limit: number;
};

type ChildReportRow = RowDataPacket & {
	child_id: number;
	first_name: string;
	avatar_url: string | null;
	searches: number;
	blocked_sites: number;
	alerts: number;
	screen_time_used: number;
	screen_time_limit: number;
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

		const [searchCountRows] = await db.query<CountRow[]>(
			`
				SELECT COUNT(*) AS total
				FROM search_history
				INNER JOIN child
					ON child.child_id = search_history.child_id
				WHERE child.parent_id = ?
			`,
			[parentId],
		);

		const [blockedCountRows] = await db.query<CountRow[]>(
			`
				SELECT COUNT(*) AS total
				FROM blocked_content
				INNER JOIN child
					ON child.child_id = blocked_content.child_id
				WHERE child.parent_id = ?
			`,
			[parentId],
		);

		const [alertCountRows] = await db.query<CountRow[]>(
			`
				SELECT COUNT(*) AS total
				FROM alert
				INNER JOIN child
					ON child.child_id = alert.child_id
				WHERE child.parent_id = ?
			`,
			[parentId],
		);

		const [screenTimeRows] = await db.query<ScreenTimeRow[]>(
			`
				SELECT
					COALESCE(SUM(safety_setting.screen_time_used), 0) AS total_used,
					COALESCE(SUM(safety_setting.screen_time_limit), 0) AS total_limit
				FROM safety_setting
				INNER JOIN child
					ON child.child_id = safety_setting.child_id
				WHERE child.parent_id = ?
			`,
			[parentId],
		);

		const [children] = await db.query<ChildReportRow[]>(
			`
				SELECT
					child.child_id,
					child.first_name,
					child.avatar_url,
					COUNT(DISTINCT search_history.search_history_id) AS searches,
					COUNT(DISTINCT blocked_content.blocked_content_id) AS blocked_sites,
					COUNT(DISTINCT alert.alert_id) AS alerts,
					COALESCE(safety_setting.screen_time_used, 0) AS screen_time_used,
					COALESCE(safety_setting.screen_time_limit, 0) AS screen_time_limit
				FROM child
				LEFT JOIN search_history
					ON search_history.child_id = child.child_id
				LEFT JOIN blocked_content
					ON blocked_content.child_id = child.child_id
				LEFT JOIN alert
					ON alert.child_id = child.child_id
				LEFT JOIN safety_setting
					ON safety_setting.child_id = child.child_id
				WHERE child.parent_id = ?
				GROUP BY
					child.child_id,
					child.first_name,
					child.avatar_url,
					safety_setting.screen_time_used,
					safety_setting.screen_time_limit
				ORDER BY child.first_name
			`,
			[parentId],
		);

		return NextResponse.json({
			summary: {
				searches: searchCountRows[0]?.total ?? 0,
				blockedSites: blockedCountRows[0]?.total ?? 0,
				alerts: alertCountRows[0]?.total ?? 0,
				screenTimeUsed: screenTimeRows[0]?.total_used ?? 0,
				screenTimeLimit: screenTimeRows[0]?.total_limit ?? 0,
			},
			children,
		});
	} catch (error) {
		console.error("GET /api/reports :", error);

		return NextResponse.json(
			{ message: "Impossible de récupérer les rapports." },
			{ status: 500 },
		);
	}
}
