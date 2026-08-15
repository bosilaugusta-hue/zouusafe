import { jwtVerify } from "jose";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import BlockedSitesManager from "@/components/dashboard/BlockedSitesManager";

type SessionPayload = {
	parentId: number;
};

type BlockedSiteRow = RowDataPacket & {
	blocked_site_id: number;
	child_id: number;
	domain: string;
	reason: string;
	created_at: string;
	first_name: string;
};

type BlockedSiteBody = {
	childId?: number;
	domain?: string;
	reason?: string;
};

function getSecretKey() {
	const secret = process.env.AUTH_SECRET;

	if (!secret) {
		throw new Error("AUTH_SECRET est absent de .env.local.");
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
	const session = payload as SessionPayload;

	return session.parentId ?? null;
}

export async function GET() {
	try {
		const parentId = await getParentId();

		if (!parentId) {
			return NextResponse.json(
				{ message: "Non authentifié." },
				{ status: 401 },
			);
		}

		const [blockedSites] = await db.query<BlockedSiteRow[]>(
			`
				SELECT
					blocked_site.blocked_site_id,
					blocked_site.child_id,
					blocked_site.domain,
					blocked_site.reason,
					blocked_site.created_at,
					child.first_name
				FROM blocked_site
				INNER JOIN child
					ON blocked_site.child_id = child.child_id
				WHERE blocked_site.parent_id = ?
				ORDER BY blocked_site.created_at DESC
			`,
			[parentId],
		);

		return NextResponse.json({ blockedSites });
	} catch (error) {
		console.error("Erreur récupération sites interdits :", error);

		return NextResponse.json(
			{ message: "Impossible de récupérer les sites interdits." },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const parentId = await getParentId();

		if (!parentId) {
			return NextResponse.json(
				{ message: "Non authentifié." },
				{ status: 401 },
			);
		}

		const body = (await request.json()) as BlockedSiteBody;

		const childId = Number(body.childId);
		const domain = body.domain?.trim().toLowerCase() ?? "";
		const reason = body.reason?.trim() || "Choix du parent";

		if (!childId || !domain) {
			return NextResponse.json(
				{ message: "L’enfant et le site sont obligatoires." },
				{ status: 400 },
			);
		}

		const [children] = await db.query<RowDataPacket[]>(
			`
				SELECT child_id
				FROM child
				WHERE child_id = ?
					AND parent_id = ?
				LIMIT 1
			`,
			[childId, parentId],
		);

		if (children.length === 0) {
			return NextResponse.json(
				{ message: "Enfant introuvable." },
				{ status: 404 },
			);
		}

		const [existingSites] = await db.query<RowDataPacket[]>(
			`
				SELECT blocked_site_id
				FROM blocked_site
				WHERE parent_id = ?
					AND child_id = ?
					AND domain = ?
				LIMIT 1
			`,
			[parentId, childId, domain],
		);

		if (existingSites.length > 0) {
			return NextResponse.json(
				{ message: "Ce site est déjà bloqué pour cet enfant." },
				{ status: 409 },
			);
		}

		const [result] = await db.execute<ResultSetHeader>(
			`
				INSERT INTO blocked_site (
					parent_id,
					child_id,
					domain,
					reason
				)
				VALUES (?, ?, ?, ?)
			`,
			[parentId, childId, domain, reason],
		);

		return NextResponse.json(
			{
				message: "Le site a été ajouté aux sites interdits.",
				blockedSiteId: result.insertId,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Erreur ajout site interdit :", error);

		return NextResponse.json(
			{ message: "Impossible d’ajouter le site interdit." },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: Request) {
	try {
		const parentId = await getParentId();

		if (!parentId) {
			return NextResponse.json(
				{ message: "Non authentifié." },
				{ status: 401 },
			);
		}

		const { searchParams } = new URL(request.url);
		const blockedSiteId = Number(searchParams.get("id"));

		if (!blockedSiteId) {
			return NextResponse.json(
				{ message: "Site interdit invalide." },
				{ status: 400 },
			);
		}

		const [result] = await db.execute<ResultSetHeader>(
			`
				DELETE FROM blocked_site
				WHERE blocked_site_id = ?
					AND parent_id = ?
			`,
			[blockedSiteId, parentId],
		);

		if (result.affectedRows === 0) {
			return NextResponse.json(
				{ message: "Site interdit introuvable." },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			message: "Le site a été retiré des sites interdits.",
		});
	} catch (error) {
		console.error("Erreur suppression site interdit :", error);

		return NextResponse.json(
			{ message: "Impossible de supprimer le site interdit." },
			{ status: 500 },
		);
	}
}