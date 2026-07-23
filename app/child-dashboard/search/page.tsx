import Image from "next/image";

import SearchFilters from "@/components/search/SearchFilters";
import SearchHeader from "@/components/search/SearchHeader";
import SearchResults from "@/components/search/SearchResults";
import SearchSidebar from "@/components/search/SearchSidebar";
import { getChildAssets } from "@/lib/get-child-assets";

type SearchPageProps = {
	searchParams: Promise<{
		childId?: string;
		query?: string;
		filter?: string;
	}>;
};

type Child = {
	child_id: number;
	first_name: string;
	avatar_url: string;
};

async function getChild(childId: number): Promise<Child | null> {
	const response = await fetch(
		`http://localhost:3000/api/children/${childId}`,
		{
			cache: "no-store",
		},
	);

	if (!response.ok) {
		return null;
	}

	const data = (await response.json()) as {
		child: Child;
	};

	return data.child;
}

export default async function SearchPage({
	searchParams,
}: SearchPageProps) {
	const {
		childId: childIdParam,
		query: queryParam,
		filter: filterParam,
	} = await searchParams;

	const childId = Number(childIdParam) || 1;
	const query = queryParam?.trim() || "Recherche";
	const activeFilter = filterParam || "all";

	const child = await getChild(childId);

	if (!child) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] px-6">
				<div className="rounded-3xl bg-white p-8 text-center shadow-md">
					<h1 className="text-2xl font-black text-slate-900">
						Enfant introuvable
					</h1>

					<p className="mt-3 text-slate-500">
						Le profil demandé n&apos;existe pas.
					</p>
				</div>
			</main>
		);
	}

	const assets = getChildAssets(child.avatar_url);

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df]">
			<SearchHeader
				childId={child.child_id}
				query={query}
			/>

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
								<span className="font-bold text-violet-600">
									{child.first_name}
								</span>
								.
							</p>
						</div>

						<Image
							src={assets.search}
							alt={`${child.first_name} avec une loupe`}
							width={260}
							height={260}
							className="h-40 w-auto object-contain md:h-48"
							priority
						/>
					</div>
				</div>

				<div className="mt-6">
					<SearchFilters
						childId={child.child_id}
						query={query}
						activeFilter={activeFilter}
					/>
				</div>

				<div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
					<section>
						<div className="mb-5 flex items-center justify-between gap-4">
							<div>
								<h2 className="text-2xl font-black text-slate-900">
									Contenus recommandés
								</h2>

								<p className="mt-1 text-sm text-slate-500">
									Résultats sécurisés proposés par ZouuSafe
								</p>
							</div>

							<div className="rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-sm font-bold text-violet-600 shadow-sm">
								Contenus vérifiés
							</div>
						</div>

						<SearchResults
							childId={child.child_id}
							query={query}
							activeFilter={activeFilter}
						/>
					</section>

					<SearchSidebar
						childId={child.child_id}
						query={query}
					/>
				</div>
			</section>
		</main>
	);
}