import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type SearchFilter =
	| "all"
	| "images"
	| "videos"
	| "stories"
	| "games"
	| "coloring";

type ImageCategory = "images" | "coloring";

type SearchBody = {
	childId?: number;
	query?: string;
	filter?: SearchFilter;
};

type ChildRow = RowDataPacket & {
	child_id: number;
	first_name: string;
	filter_level: string | null;
	safe_search: boolean | null;
};

type WebResult = {
	title?: string;
	url?: string;
	description?: string;
	profile?: {
		long_name?: string;
	};
};

type WebResponse = {
	web?: {
		results?: WebResult[];
	};
};

type ImageResult = {
	title?: string;
	url?: string;
	source?: string;
	thumbnail?: {
		src?: string;
	};
	properties?: {
		url?: string;
	};
};

type ImageResponse = {
	results?: ImageResult[];
};

type VideoResult = {
	title?: string;
	url?: string;
	description?: string;
	thumbnail?: {
		src?: string;
	};
	profile?: {
		long_name?: string;
	};
};

type VideoResponse = {
	results?: VideoResult[];
};

type NormalizedResult = {
	id: string;
	title: string;
	url: string;
	description: string;
	source: string;
	image: string | null;
	category: SearchFilter;
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

const validFilters: SearchFilter[] = [
	"all",
	"images",
	"videos",
	"stories",
	"games",
	"coloring",
];

function normalizeText(value: string) {
	return value
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.trim();
}

function isBlockedQuery(query: string) {
	const normalizedQuery = normalizeText(query);

	return blockedWords.some((word) =>
		normalizedQuery.includes(normalizeText(word)),
	);
}

function getSourceName(url: string) {
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return "Site Internet";
	}
}

function getSafeFilter(filter: SearchBody["filter"]): SearchFilter {
	if (filter && validFilters.includes(filter)) {
		return filter;
	}

	return "all";
}

function getAdaptedQuery(query: string, filter: SearchFilter) {
	switch (filter) {
		case "images":
			return `${query} illustration enfant cartoon 3D mignon coloré`;

		case "videos":
			return `${query} vidéo éducative enfant dessin animé français`;

		case "stories":
			return `${query} histoire illustrée pour enfants dessin animé`;

		case "games":
			return `${query} jeu éducatif enfant dessin animé`;

		case "coloring":
			return `${query} coloriage enfant personnage cartoon mignon noir et blanc à imprimer gratuit`;

		default:
			return query;
	}
}

function getEndpoint(filter: SearchFilter) {
	if (filter === "images" || filter === "coloring") {
		return "https://api.search.brave.com/res/v1/images/search";
	}

	if (filter === "videos") {
		return "https://api.search.brave.com/res/v1/videos/search";
	}

	return "https://api.search.brave.com/res/v1/web/search";
}

function normalizeWebResults(
	data: WebResponse,
	filter: SearchFilter,
): NormalizedResult[] {
	return (data.web?.results ?? [])
		.filter((result) => result.title && result.url && result.description)
		.map((result, index) => ({
			id: `${filter}-${index}-${result.url}`,
			title: result.title ?? "Résultat",
			url: result.url ?? "",
			description: result.description ?? "Aucune description disponible.",
			source: result.profile?.long_name ?? getSourceName(result.url ?? ""),
			image: null,
			category: filter,
		}));
}

function normalizeImageResults(
	data: ImageResponse,
	category: ImageCategory,
): NormalizedResult[] {
	return (data.results ?? [])
		.filter(
			(result) =>
				result.title &&
				result.url &&
				(result.thumbnail?.src || result.properties?.url),
		)
		.map((result, index) => ({
			id: `${category}-${index}-${result.url}`,
			title:
				result.title ??
				(category === "coloring"
					? "Coloriage pour enfant"
					: "Illustration pour enfant"),
			url: result.url ?? "",
			description:
				category === "coloring"
					? "Un dessin amusant à imprimer et à colorier."
					: "Une illustration trouvée par la recherche sécurisée ZouuSafe.",
			source: result.source ?? getSourceName(result.url ?? ""),
			image: result.thumbnail?.src ?? result.properties?.url ?? null,
			category,
		}));
}

function normalizeVideoResults(data: VideoResponse): NormalizedResult[] {
	return (data.results ?? [])
		.filter((result) => result.title && result.url)
		.map((result, index) => ({
			id: `videos-${index}-${result.url}`,
			title: result.title ?? "Vidéo",
			url: result.url ?? "",
			description:
				result.description ??
				"Vidéo trouvée par la recherche sécurisée ZouuSafe.",
			source: result.profile?.long_name ?? getSourceName(result.url ?? ""),
			image: result.thumbnail?.src ?? null,
			category: "videos",
		}));
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as SearchBody;

		const childId = Number(body.childId);
		const query = body.query?.trim();
		const filter = getSafeFilter(body.filter);

		if (!childId || !query) {
			return NextResponse.json(
				{
					message: "L’enfant et la recherche sont obligatoires.",
				},
				{ status: 400 },
			);
		}

		if (query.length > 200) {
			return NextResponse.json(
				{
					message: "La recherche est trop longue.",
				},
				{ status: 400 },
			);
		}

		const [children] = await db.execute<ChildRow[]>(
			`
				SELECT
					child.child_id,
					child.first_name,
					safety_setting.filter_level,
					safety_setting.safe_search
				FROM child
				LEFT JOIN safety_setting
					ON safety_setting.child_id = child.child_id
				WHERE child.child_id = ?
				LIMIT 1
			`,
			[childId],
		);

		const child = children[0];

		if (!child) {
			return NextResponse.json(
				{
					message: "Le profil enfant est introuvable.",
				},
				{ status: 404 },
			);
		}

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

		if (isBlockedQuery(query)) {
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
					`Recherche non autorisée détectée pour ${child.first_name} : "${query}"`,
					"high",
					childId,
				],
			);

			return NextResponse.json({
				allowed: false,
				query,
				filter,
				results: [],
				message:
					"Cette recherche n’est pas adaptée. Essaie un sujet amusant, scientifique ou éducatif.",
			});
		}

		const apiKey = process.env.BRAVE_SEARCH_API_KEY;

		if (!apiKey) {
			console.error("BRAVE_SEARCH_API_KEY est absente de .env.local.");

			return NextResponse.json(
				{
					message: "Le moteur de recherche n’est pas configuré.",
				},
				{ status: 500 },
			);
		}

		const adaptedQuery = getAdaptedQuery(query, filter);
		const endpoint = getEndpoint(filter);

		const searchParams = new URLSearchParams({
			q: adaptedQuery,
			country: "FR",
			search_lang: "fr",
			count: "12",
			safesearch: "strict",
			spellcheck: "true",
		});

		if (filter !== "images" && filter !== "coloring") {
			searchParams.set("ui_lang", "fr-FR");
		}

		const braveResponse = await fetch(
			`${endpoint}?${searchParams.toString()}`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					"Accept-Encoding": "gzip",
					"Cache-Control": "no-cache",
					"X-Subscription-Token": apiKey,
				},
				cache: "no-store",
			},
		);

		if (!braveResponse.ok) {
			const braveError = await braveResponse.text();

			console.error("Erreur Brave Search :", braveResponse.status, braveError);

			return NextResponse.json(
				{
					message: "Le moteur de recherche est temporairement indisponible.",
				},
				{ status: 502 },
			);
		}

		let results: NormalizedResult[] = [];

		if (filter === "images" || filter === "coloring") {
			const braveData = (await braveResponse.json()) as ImageResponse;

			results = normalizeImageResults(braveData, filter);
		} else if (filter === "videos") {
			const braveData = (await braveResponse.json()) as VideoResponse;

			results = normalizeVideoResults(braveData);
		} else {
			const braveData = (await braveResponse.json()) as WebResponse;

			results = normalizeWebResults(braveData, filter);
		}

		return NextResponse.json({
			allowed: true,
			query,
			filter,
			results,
			message: results.length === 0 ? "Aucun résultat trouvé." : null,
		});
	} catch (error) {
		console.error("Erreur pendant la recherche sécurisée :", error);

		return NextResponse.json(
			{
				message: "Une erreur est survenue pendant la recherche.",
			},
			{ status: 500 },
		);
	}
}
