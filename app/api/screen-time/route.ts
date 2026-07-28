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
	screen_time_limit: number | null;
	screen_time_used: number | null;
	screen_time_date: string | Date | null;
	filter_level: string | null;
	safe_search: boolean | null;
};

type ChildScreenTimeRow = RowDataPacket & {
	screen_time_limit: number | null;
	screen_time_used: number | null;
	screen_time_date: string | Date | null;
};

type UpdateScreenTimeBody = {
	childId?: number;
};

function getSecretKey() {
	const secret = process.env.AUTH_SECRET;

	if (!secret) {
		throw new Error("AUTH_SECRET est absent de .env.local.");
	}

	return new TextEncoder().encode(secret);
}

function formatDatabaseDate(value: string | Date | null) {
	if (!value) {
		return null;
	}

	if (value instanceof Date) {
		return value.toISOString().slice(0, 10);
	}

	return value.slice(0, 10);
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

		const [children] = await db.query<ScreenTimeRow[]>(
			`
					SELECT
						child.child_id,
						child.first_name,
						child.avatar_url,
						safety_setting.screen_time_limit,
						safety_setting.screen_time_used,
						safety_setting.screen_time_date,
						safety_setting.filter_level,
						safety_setting.safe_search
					FROM child
					LEFT JOIN safety_setting
						ON safety_setting.child_id =
							child.child_id
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
				message: "Impossible de récupérer les données de temps d’écran.",
			},
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as UpdateScreenTimeBody;

		const childId = Number(body.childId);

		if (!Number.isInteger(childId) || childId <= 0) {
			return NextResponse.json(
				{
					message: "Identifiant enfant invalide.",
				},
				{ status: 400 },
			);
		}

		const [settings] = await db.query<ChildScreenTimeRow[]>(
			`
					SELECT
						screen_time_limit,
						screen_time_used,
						screen_time_date
					FROM safety_setting
					WHERE child_id = ?
					LIMIT 1
				`,
			[childId],
		);

		const setting = settings[0];

		if (!setting) {
			return NextResponse.json(
				{
					message: "Aucun réglage de temps d’écran trouvé.",
				},
				{ status: 404 },
			);
		}

		const [todayRows] = await db.query<
			(RowDataPacket & {
				today: string;
			})[]
		>(
			`
				SELECT DATE_FORMAT(
					CURDATE(),
					'%Y-%m-%d'
				) AS today
			`,
		);

		const today = todayRows[0]?.today;
		const savedDate = formatDatabaseDate(setting.screen_time_date);

		let screenTimeUsed = setting.screen_time_used ?? 0;

		if (!today) {
			return NextResponse.json(
				{
					message: "Impossible de déterminer la date actuelle.",
				},
				{ status: 500 },
			);
		}

		if (savedDate !== today) {
			await db.execute(
				`
					UPDATE safety_setting
					SET
						screen_time_used = 0,
						screen_time_date = CURDATE()
					WHERE child_id = ?
				`,
				[childId],
			);

			screenTimeUsed = 0;
		}

		const screenTimeLimit = setting.screen_time_limit;

		if (screenTimeLimit !== null && screenTimeUsed >= screenTimeLimit) {
			return NextResponse.json({
				limitReached: true,
				screenTimeUsed,
				screenTimeLimit,
			});
		}

		await db.execute(
			`
				UPDATE safety_setting
				SET
					screen_time_used =
						COALESCE(
							screen_time_used,
							0
						) + 1,
					screen_time_date = CURDATE()
				WHERE child_id = ?
			`,
			[childId],
		);

		const newScreenTimeUsed = screenTimeUsed + 1;

		const limitReached =
			screenTimeLimit !== null && newScreenTimeUsed >= screenTimeLimit;

		return NextResponse.json({
			limitReached,
			screenTimeUsed: newScreenTimeUsed,
			screenTimeLimit,
		});
	} catch (error) {
		console.error("POST /api/screen-time :", error);

		return NextResponse.json(
			{
				message: "Impossible de comptabiliser le temps d’écran.",
			},
			{ status: 500 },
		);
	}
}
