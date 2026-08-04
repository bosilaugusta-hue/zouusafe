import { access } from "node:fs/promises";
import path from "node:path";

import { jwtVerify } from "jose";
import type { ResultSetHeader } from "mysql2";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type SessionPayload = {
	parentId: number;
};

type AvatarBody = {
	avatarUrl?: string;
};

function getSecretKey() {
	const secret = process.env.AUTH_SECRET;

	if (!secret) {
		throw new Error("AUTH_SECRET est absent de .env.local.");
	}

	return new TextEncoder().encode(secret);
}

function isAllowedAvatarPath(avatarUrl: string) {
	return (
		avatarUrl.startsWith("/avatars-profil/") &&
		!avatarUrl.includes("..") &&
		/\.(png|jpe?g|webp)$/i.test(avatarUrl)
	);
}

export async function PATCH(request: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("zouusafe_session")?.value;

		if (!token) {
			return NextResponse.json(
				{
					message: "Vous devez être connecté.",
				},
				{
					status: 401,
				},
			);
		}

		const { payload } = await jwtVerify(token, getSecretKey());
		const session = payload as SessionPayload;
		const parentId = session.parentId;

		if (!parentId) {
			return NextResponse.json(
				{
					message: "Session invalide.",
				},
				{
					status: 401,
				},
			);
		}

		const body = (await request.json()) as AvatarBody;
		const avatarUrl = body.avatarUrl?.trim() ?? "";

		if (!avatarUrl) {
			return NextResponse.json(
				{
					message: "Veuillez sélectionner une photo de profil.",
				},
				{
					status: 400,
				},
			);
		}

		if (!isAllowedAvatarPath(avatarUrl)) {
			return NextResponse.json(
				{
					message: "Le chemin de la photo n’est pas autorisé.",
				},
				{
					status: 400,
				},
			);
		}

		const relativeAvatarPath = avatarUrl.replace(/^\/+/, "");

		const publicDirectory = path.resolve(process.cwd(), "public");
		const avatarsDirectory = path.resolve(
			publicDirectory,
			"avatars-profil",
		);

		const absoluteAvatarPath = path.resolve(
			publicDirectory,
			relativeAvatarPath,
		);

		if (!absoluteAvatarPath.startsWith(`${avatarsDirectory}${path.sep}`)) {
			return NextResponse.json(
				{
					message: "Le chemin de la photo n’est pas autorisé.",
				},
				{
					status: 400,
				},
			);
		}

		try {
			await access(absoluteAvatarPath);
		} catch {
			return NextResponse.json(
				{
					message: "La photo sélectionnée est introuvable.",
				},
				{
					status: 404,
				},
			);
		}

		const [result] = await db.execute<ResultSetHeader>(
			`
				UPDATE parent
				SET avatar_url = ?
				WHERE parent_id = ?
			`,
			[avatarUrl, parentId],
		);

		if (result.affectedRows === 0) {
			return NextResponse.json(
				{
					message: "Parent introuvable.",
				},
				{
					status: 404,
				},
			);
		}

		return NextResponse.json({
			message: "Votre photo de profil a été mise à jour.",
			avatarUrl,
		});
	} catch (error) {
		console.error(
			"Erreur lors de la modification de la photo :",
			error,
		);

		return NextResponse.json(
			{
				message:
					"Une erreur est survenue pendant la modification de la photo.",
			},
			{
				status: 500,
			},
		);
	}
}