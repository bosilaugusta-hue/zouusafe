import { ArrowLeft, Clock3, Search } from "lucide-react";
import Link from "next/link";

type SearchHistoryItem = {
	search_history_id: number;
	search_query: string;
	created_at: string;
};

type HistoryPageProps = {
	searchParams: Promise<{
		childId?: string;
	}>;
};

async function getSearchHistory(childId: number) {
	const response = await fetch(
		`http://localhost:3000/api/search-history?childId=${childId}`,
		{
			cache: "no-store",
		},
	);

	if (!response.ok) {
		return [];
	}

	const data = (await response.json()) as {
		history: SearchHistoryItem[];
	};

	return data.history;
}

function formatDate(date: string) {
	return new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
	const { childId: childIdParam } = await searchParams;

	const childId = Number(childIdParam) || 1;
	const history = await getSearchHistory(childId);

	return (
		<main className="min-h-screen bg-gradient-to-b from-blue-50 via-violet-50 to-amber-50 px-6 py-10 text-slate-900">
			<section className="mx-auto w-full max-w-4xl">
				<Link
					href={`/child-dashboard?childId=${childId}`}
					className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-violet-700 shadow-sm transition hover:-translate-y-0.5"
				>
					<ArrowLeft size={18} aria-hidden="true" />
					Retour
				</Link>

				<div className="mt-6 rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(88,80,150,0.12)] backdrop-blur-xl sm:p-8">
					<header className="flex items-center gap-4">
						<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
							<Search size={26} aria-hidden="true" />
						</div>

						<div>
							<p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-500">
								Activité de Zoé
							</p>

							<h1 className="text-3xl font-black text-slate-900">
								Toutes les recherches
							</h1>
						</div>
					</header>

					<div className="mt-8">
						{history.length === 0 ? (
							<p className="rounded-2xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
								Aucune recherche enregistrée pour le moment.
							</p>
						) : (
							<ul className="space-y-3">
								{history.map((item) => (
									<li key={item.search_history_id}>
										<Link
											href={`/child-dashboard/search?childId=${childId}&query=${encodeURIComponent(
												item.search_query,
											)}&filter=all`}
											className="flex items-center justify-between gap-4 rounded-2xl border border-violet-100 bg-violet-50/70 px-5 py-4 transition hover:bg-violet-100"
										>
											<div className="min-w-0">
												<p className="text-xs font-bold uppercase tracking-wide text-violet-500">
													Recherche
												</p>

												<p className="mt-1 truncate font-black text-slate-900">
													{item.search_query}
												</p>
											</div>

											<div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-slate-500">
												<Clock3 size={15} aria-hidden="true" />

												<time dateTime={item.created_at}>
													{formatDate(item.created_at)}
												</time>
											</div>
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</section>
		</main>
	);
}
