import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { jwtVerify } from "jose";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedFileTypes = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
} as const;

type AllowedMimeType = keyof typeof allowedFileTypes;

type SessionPayload = {
	parentId: number;
};

type ParentAvatarRow = RowDataPacket & {
	avatar_url: string | null;
};

function getSecretKey() {
	const secret = process.env.AUTH_SECRET;

	if (!secret) {
		throw new Error("AUTH_SECRET est absent de .env.local.");
	}

	return new TextEncoder().encode(secret);
}

function isAllowedMimeType(type: string): type is AllowedMimeType {
	return type in allowedFileTypes;
}

function isJpeg(buffer: Buffer) {
	return (
		buffer.length >= 3 &&
		buffer[0] === 0xff &&
		buffer[1] === 0xd8 &&
		buffer[2] === 0xff
	);
}

function isPng(buffer: Buffer) {
	return (
		buffer.length >= 8 &&
		buffer[0] === 0x89 &&
		buffer[1] === 0x50 &&
		buffer[2] === 0x4e &&
		buffer[3] === 0x47 &&
		buffer[4] === 0x0d &&
		buffer[5] === 0x0a &&
		buffer[6] === 0x1a &&
		buffer[7] === 0x0a
	);
}

function isWebp(buffer: Buffer) {
	return (
		buffer.length >= 12 &&
		buffer.toString("ascii", 0, 4) === "RIFF" &&
		buffer.toString("ascii", 8, 12) === "WEBP"
	);
}

function fileSignatureMatchesMimeType(
	buffer: Buffer,
	mimeType: AllowedMimeType,
) {
	if (mimeType === "image/jpeg") {
		return isJpeg(buffer);
	}

	if (mimeType === "image/png") {
		return isPng(buffer);
	}

	if (mimeType === "image/webp") {
		return isWebp(buffer);
	}

	return false;
}

async function removePreviousUploadedAvatar(
	parentId: number,
	avatarUrl: string | null,
) {
	if (!avatarUrl) {
		return;
	}

	const expectedPrefix = `/avatars-profil/parent-${parentId}-`;

	if (!avatarUrl.startsWith(expectedPrefix)) {
		return;
	}

	const relativePath = avatarUrl.replace(/^\/+/, "");

	const absolutePath = path.join(
		process.cwd(),
		"public",
		relativePath,
	);

	try {
		await unlink(absolutePath);
	} catch {
		
	}
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

		const formData = await request.formData();
		const avatar = formData.get("avatar");

		if (!(avatar instanceof File)) {
			return NextResponse.json(
				{
					message: "Veuillez sélectionner une photo.",
				},
				{
					status: 400,
				},
			);
		}

		if (avatar.size === 0) {
			return NextResponse.json(
				{
					message: "Le fichier sélectionné est vide.",
				},
				{
					status: 400,
				},
			);
		}

		if (avatar.size > MAX_FILE_SIZE) {
			return NextResponse.json(
				{
					message: "La photo ne doit pas dépasser 5 Mo.",
				},
				{
					status: 400,
				},
			);
		}

		if (!isAllowedMimeType(avatar.type)) {
			return NextResponse.json(
				{
					message:
						"Seuls les formats JPG, PNG et WebP sont autorisés.",
				},
				{
					status: 400,
				},
			);
		}

		const fileBuffer = Buffer.from(
			await avatar.arrayBuffer(),
		);

		if (!fileSignatureMatchesMimeType(fileBuffer, avatar.type)) {
			return NextResponse.json(
				{
					message:
						"Le contenu du fichier ne correspond pas à une image valide.",
				},
				{
					status: 400,
				},
			);
		}

		const [parents] = await db.query<ParentAvatarRow[]>(
			`
				SELECT avatar_url
				FROM parent
				WHERE parent_id = ?
				LIMIT 1
			`,
			[parentId],
		);

		const parent = parents[0];

		if (!parent) {
			return NextResponse.json(
				{
					message: "Parent introuvable.",
				},
				{
					status: 404,
				},
			);
		}

		const extension = allowedFileTypes[avatar.type];
		const fileName = `parent-${parentId}-${randomUUID()}.${extension}`;

		const avatarsDirectory = path.join(
			process.cwd(),
			"public",
			"avatars-profil",
		);

		await mkdir(avatarsDirectory, {
			recursive: true,
		});

		const absoluteFilePath = path.join(
			avatarsDirectory,
			fileName,
		);

		await writeFile(absoluteFilePath, fileBuffer);

		const avatarUrl = `/avatars-profil/${fileName}`;

		const [result] = await db.execute<ResultSetHeader>(
			`
				UPDATE parent
				SET avatar_url = ?
				WHERE parent_id = ?
			`,
			[avatarUrl, parentId],
		);

		if (result.affectedRows === 0) {
			await unlink(absoluteFilePath).catch(
				() => undefined,
			);

			return NextResponse.json(
				{
					message:
						"La photo n’a pas pu être enregistrée.",
				},
				{
					status: 500,
				},
			);
		}

		await removePreviousUploadedAvatar(
			parentId,
			parent.avatar_url,
		);

		return NextResponse.json({
			message:
				"Votre photo de profil a été mise à jour.",
			avatarUrl,
		});
	} catch (error) {
		console.error(
			"Erreur lors de l’upload de la photo du parent :",
			error,
		);

		return NextResponse.json(
			{
				message:
					"Une erreur est survenue pendant l’enregistrement de la photo.",
			},
			{
				status: 500,
			},
		);
	}
}