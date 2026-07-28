import { jwtVerify } from "jose";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
	safe_search: number;
};

type UpdateSettingsBody = {
	childId?: number;
	screenTimeLimit?: number;
	filterLevel?: string;
	safeSearch?: boolean;
};

function getSecretKey() {
	const secret = process.env.AUTH_SECRET;

	if (!secret) {
		throw new Error("AUTH_SECRET absent.");
	}

	return new TextEncoder().encode(secret);
}

async function getParentId() {
	const cookieStore = await cookies();
	const token = cookieStore.get("zouusafe_session")?.value;

	if (!token) {
		return null;
	}

	const { payload } = await jwtVerify(token, getSecretKey());

	const session = payload as unknown as SessionPayload;

	return session.parentId ?? null;
}

export async function GET() {
	try {
		const parentId = await getParentId();

		if (!parentId) {
			return NextResponse.json({ message: "Non connecté." }, { status: 401 });
		}

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
					ON child.child_id = safety_setting.child_id
				WHERE child.parent_id = ?
				ORDER BY child.first_name
			`,
			[parentId],
		);

		return NextResponse.json({
			settings: settings.map((setting) => ({
				...setting,
				safe_search: Boolean(setting.safe_search),
			})),
		});
	} catch (error) {
		console.error("Erreur pendant la récupération des paramètres :", error);

		return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
	}
}

export async function PUT(request: Request) {
	try {
		const parentId = await getParentId();

		if (!parentId) {
			return NextResponse.json({ message: "Non connecté." }, { status: 401 });
		}

		const body = (await request.json()) as UpdateSettingsBody;

		const { childId, screenTimeLimit, filterLevel, safeSearch } = body;

		if (
			!childId ||
			typeof screenTimeLimit !== "number" ||
			typeof safeSearch !== "boolean" ||
			!filterLevel
		) {
			return NextResponse.json(
				{
					message: "Les paramètres envoyés sont incomplets.",
				},
				{ status: 400 },
			);
		}

		if (filterLevel !== "standard" && filterLevel !== "strict") {
			return NextResponse.json(
				{
					message: "Le niveau de filtrage est invalide.",
				},
				{ status: 400 },
			);
		}

		if (screenTimeLimit < 15 || screenTimeLimit > 600) {
			return NextResponse.json(
				{
					message: "La limite doit être comprise entre 15 et 600 minutes.",
				},
				{ status: 400 },
			);
		}

		const [result] = await db.execute<ResultSetHeader>(
			`
				UPDATE safety_setting
				INNER JOIN child
					ON child.child_id = safety_setting.child_id
				SET
					safety_setting.screen_time_limit = ?,
					safety_setting.filter_level = ?,
					safety_setting.safe_search = ?
				WHERE safety_setting.child_id = ?
					AND child.parent_id = ?
			`,
			[screenTimeLimit, filterLevel, safeSearch ? 1 : 0, childId, parentId],
		);

		if (result.affectedRows === 0) {
			return NextResponse.json(
				{
					message: "Profil enfant introuvable ou paramètres inchangés.",
				},
				{ status: 404 },
			);
		}

		return NextResponse.json({
			message: "Les paramètres ont bien été enregistrés.",
		});
	} catch (error) {
		console.error("Erreur pendant la mise à jour des paramètres :", error);

		return NextResponse.json(
			{
				message: "Impossible d’enregistrer les paramètres.",
			},
			{ status: 500 },
		);
	}
}
