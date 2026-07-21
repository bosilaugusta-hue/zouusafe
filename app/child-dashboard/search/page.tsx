import Image from "next/image";

import SearchFilters from "@/components/search/SearchFilters";
import SearchHeader from "@/components/search/SearchHeader";
import SearchResultCard from "@/components/search/SearchResultCard";
import SearchSidebar from "@/components/search/SearchSidebar";
import { searchResults } from "@/data/searchResults";

type SearchPageProps = {
	searchParams: Promise<{
		childId?: string;
		query?: string;
		filter?: string;
	}>;
};

function normalizeSearch(value: string) {
	return value
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.trim();
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const {
		childId: childIdParam,
		query: queryParam,
		filter: filterParam,
	} = await searchParams;

	const childId = Number(childIdParam) || 1;
	const query = queryParam?.trim() || "Recherche";
	const activeFilter = filterParam || "all";

	const normalizedQuery = normalizeSearch(query);

	const matchedKey = Object.keys(searchResults).find((key) =>
		normalizedQuery.includes(key),
	);

	const results = matchedKey
		? searchResults[matchedKey as keyof typeof searchResults]
		: [];

	const childName = "Zoé";
	const standingAvatar = "/enfants/fille15-loupe.png";

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df]">
			<SearchHeader childId={childId} query={query} />

			<section className="mx-auto w-full max-w-[1500px] px-4 pt-6 pb-12 sm:px-6 lg:px-8">
				<div className="overflow-hidden rounded-[32px] border border-white/80 bg-white/60 px-6 py-7 shadow-[0_18px_50px_rgba(88,80,150,0.12)] backdrop-blur-xl md:px-9">
					<div className="flex flex-col items-center justify-between gap-6 md:flex-row">
						<div className="text-center md:text-left">
							<p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-500">
								Recherche sécurisée
							</p>

							<h1 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
								Résultats pour « {query} »
							</h1>

							<p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
								Voici des contenus amusants et adaptés à l&apos;âge de{" "}
								<span className="font-bold text-violet-600">{childName}</span>.
							</p>
						</div>

						<Image
							src={standingAvatar}
							alt={`Avatar de ${childName}`}
							width={260}
							height={260}
							className="h-40 w-auto object-contain md:h-48"
						/>
					</div>
				</div>

			<div className="mt-6">
	<SearchFilters activeFilter={activeFilter} />
</div>

				<div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
					<section>
						<div className="mb-5 flex items-center justify-between gap-4">
							<div>
								<h2 className="text-2xl font-black text-slate-900">
									Contenus recommandés
								</h2>

								<p className="mt-1 text-sm text-slate-500">
									{results.length} résultat
									{results.length > 1 ? "s" : ""} trouvé
									{results.length > 1 ? "s" : ""}
								</p>
							</div>

							<div className="rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-sm font-bold text-violet-600 shadow-sm">
								Contenus vérifiés
							</div>
						</div>

						<div className="space-y-6">
							{results.length > 0 ? (
								results.map((result) => (
									<SearchResultCard
										key={`${matchedKey}-${result.id}`}
										title={result.title}
										description={result.description}
										image={result.image}
										source={result.source}
										category={result.category}
										age={result.age}
										duration={result.duration}
										level={result.level}
										url={result.url}
									/>
								))
							) : (
								<div className="rounded-[28px] border border-white/80 bg-white/80 p-10 text-center shadow-[0_15px_45px_rgba(88,80,150,0.10)] backdrop-blur-xl">
									<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-4xl">
										🔍
									</div>

									<h2 className="mt-5 text-2xl font-black text-slate-900">
										Aucun résultat pour « {query} »
									</h2>

									<p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
										Essaie une nouvelle recherche avec un mot simple comme
										dinosaures, princesse, planètes, animaux, football ou
										volcans.
									</p>
								</div>
							)}
						</div>
					</section>

					<aside>
						<SearchSidebar childId={childId} query={query} />
					</aside>
				</div>
			</section>
		</main>
	);
}
