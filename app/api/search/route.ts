import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type SearchBody = {
	childId?: number;
	query?: string;
};

const blockedWords = [
	"arme",
	"armes",
	"drogue",
	"drogues",
	"porno",
	"pornographie",
	"sexe",
	"suicide",
	"meurtre",
	"tuer",
	"violence",
];

function normalizeText(value: string) {
	return value
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.trim();
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as SearchBody;

		const childId = Number(body.childId);
		const query = body.query?.trim();

		if (!childId || !query) {
			return NextResponse.json(
				{
					message: "La recherche est invalide.",
				},
				{ status: 400 },
			);
		}

		const normalizedQuery = normalizeText(query);

		const isBlocked = blockedWords.some((word) =>
			normalizedQuery.includes(normalizeText(word)),
		);

		await db.execute(
			`
				INSERT INTO search_history (
					child_id,
					search_query
				)
				VALUES (?, ?)
			`,
			[childId, query],
		);

		if (isBlocked) {
			await db.execute(
				`
					INSERT INTO alert (
						message,
						severity,
						child_id
					)
					VALUES (?, ?, ?)
				`,
				[
					`Une recherche non autorisée a été détectée : "${query}"`,
					"high",
					childId,
				],
			);

			return NextResponse.json({
				allowed: false,
				message:
					"Cette recherche n’est pas adaptée. Essaie plutôt un sujet amusant ou éducatif.",
			});
		}

		return NextResponse.json({
			allowed: true,
		});
	} catch (error) {
		console.error(
			"Erreur pendant la vérification de la recherche :",
			error,
		);

		return NextResponse.json(
			{
				message: "Impossible de vérifier la recherche.",
			},
			{ status: 500 },
		);
	}
}