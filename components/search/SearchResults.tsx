"use client";

import { Search, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

import SearchResultCard from "@/components/search/SearchResultCard";

type SearchResult = {
	id: string;
	title: string;
	url: string;
	description: string;
	source: string;
	image: string | null;
	category: "all" | "images" | "videos" | "stories" | "games" | "coloring";
};

type SearchApiResponse = {
	allowed: boolean;
	query: string;
	results: SearchResult[];
	message: string | null;
};

type SearchResultsProps = {
	childId: number;
	query: string;
	activeFilter?: string;
};

const skeletonKeys = ["s1", "s2", "s3", "s4"];

function ResultsSkeleton() {
	return (
		<div className="space-y-5">
			{skeletonKeys.map((key) => (
				<div
					key={key}
					className="animate-pulse rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-sm"
				>
					<div className="flex flex-col gap-5 sm:flex-row">
						<div className="h-40 w-full rounded-3xl bg-violet-100 sm:w-56" />

						<div className="flex-1">
							<div className="h-4 w-32 rounded-full bg-violet-100" />
							<div className="mt-5 h-7 w-3/4 rounded-full bg-slate-200" />
							<div className="mt-4 h-4 w-full rounded-full bg-slate-100" />
							<div className="mt-2 h-4 w-5/6 rounded-full bg-slate-100" />
							<div className="mt-6 h-10 w-32 rounded-full bg-violet-100" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export default function SearchResults({
	childId,
	query,
	activeFilter = "all",
}: SearchResultsProps) {
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isAllowed, setIsAllowed] = useState(true);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();

		async function loadResults() {
			try {
				setIsLoading(true);
				setError("");
				setMessage("");
				setResults([]);

				const response = await fetch("/api/search", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						childId,
						query,
						filter: activeFilter,
					}),
					signal: controller.signal,
				});

				const data = (await response.json()) as SearchApiResponse;

				if (!response.ok) {
					throw new Error(
						data.message || "Impossible de charger les résultats.",
					);
				}

				setIsAllowed(data.allowed);
				setResults(data.results ?? []);
				setMessage(data.message ?? "");
			} catch (caughtError) {
				if (caughtError instanceof Error && caughtError.name === "AbortError") {
					return;
				}

				setError(
					caughtError instanceof Error
						? caughtError.message
						: "Une erreur est survenue pendant la recherche.",
				);
			} finally {
				if (!controller.signal.aborted) {
					setIsLoading(false);
				}
			}
		}

		loadResults();

		return () => {
			controller.abort();
		};
	}, [childId, query, activeFilter]);

	if (isLoading) {
		return <ResultsSkeleton />;
	}

	if (error) {
		return (
			<div className="rounded-[28px] border border-rose-100 bg-rose-50 p-10 text-center shadow-sm">
				<ShieldAlert
					size={48}
					aria-hidden="true"
					className="mx-auto text-rose-500"
				/>

				<h2 className="mt-5 text-2xl font-black text-slate-900">
					La recherche est indisponible
				</h2>

				<p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
					{error}
				</p>
			</div>
		);
	}

	if (!isAllowed) {
		return (
			<div className="rounded-[28px] border border-amber-200 bg-amber-50 p-10 text-center shadow-sm">
				<ShieldAlert
					size={52}
					aria-hidden="true"
					className="mx-auto text-amber-600"
				/>

				<h2 className="mt-5 text-2xl font-black text-slate-900">
					Recherche non autorisée
				</h2>

				<p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
					{message || "Cette recherche n’est pas adaptée aux enfants."}
				</p>
			</div>
		);
	}

	if (results.length === 0) {
		return (
			<div className="rounded-[28px] border border-white/80 bg-white/80 p-10 text-center shadow-sm">
				<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
					<Search size={36} aria-hidden="true" className="text-violet-600" />
				</div>

				<h2 className="mt-5 text-2xl font-black text-slate-900">
					Aucun résultat pour « {query} »
				</h2>

				<p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
					{message ||
						"Essaie une nouvelle recherche avec des mots plus simples."}
				</p>
			</div>
		);
	}

	const isGallery = activeFilter === "images" || activeFilter === "coloring";

	return (
		<div>
			<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-sm font-black text-violet-700 shadow-sm">
				<Search size={17} aria-hidden="true" />
				{results.length} résultat
				{results.length > 1 ? "s" : ""} trouvé
				{results.length > 1 ? "s" : ""}
			</div>

			<div
				className={
					isGallery ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "space-y-5"
				}
			>
				{results.map((result) => (
					<SearchResultCard
						key={result.id}
						title={result.title}
						description={result.description}
						source={result.source}
						url={result.url}
						image={result.image}
						category={result.category}
					/>
				))}
			</div>
		</div>
	);
}
