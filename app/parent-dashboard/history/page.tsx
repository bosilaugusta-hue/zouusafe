import {
	CalendarDays,
	CheckCircle2,
	Search,
	ShieldCheck,
	UserRound,
} from "lucide-react";
import { cookies } from "next/headers";

type HistoryItem = {
	search_history_id: number;
	search_query: string;
	created_at: string;
	child_id: number;
	first_name: string;
	avatar_url: string | null;
};

type HistoryResponse = {
	history: HistoryItem[];
};

async function getHistory(): Promise<HistoryItem[]> {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("zouusafe_session");

	if (!sessionCookie) {
		throw new Error("Session utilisateur introuvable.");
	}

	const response = await fetch("http://localhost:3000/api/history", {
		cache: "no-store",
		headers: {
			Cookie: `zouusafe_session=${sessionCookie.value}`,
		},
	});

	if (!response.ok) {
		throw new Error("Impossible de récupérer l’historique.");
	}

	const data = (await response.json()) as HistoryResponse;

	return data.history;
}

function formatDate(date: string) {
	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) {
		return "Date indisponible";
	}

	return new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(parsedDate);
}

export default async function HistoryPage() {
	const history = await getHistory();

	const childrenCount = new Set(history.map((item) => item.child_id)).size;

	return (
		<main className="space-y-6">
			<header className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(91,33,182,0.1)] backdrop-blur-xl">
				<div className="flex items-center gap-4">
					<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
						<Search size={27} aria-hidden="true" />
					</span>

					<div>
						<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
							Activité des enfants
						</p>

						<h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
							Historique des recherches
						</h1>

						<p className="mt-1.5 text-sm leading-5 text-slate-500">
							Consultez les recherches effectuées par vos enfants.
						</p>
					</div>
				</div>
			</header>

			<section className="grid gap-4 md:grid-cols-3">
				<article className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(30,41,59,0.08)] backdrop-blur-xl">
					<div className="flex items-center gap-4">
						<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
							<Search size={22} aria-hidden="true" />
						</span>

						<div>
							<p className="text-sm font-bold text-slate-500">
								Total des recherches
							</p>

							<p className="mt-1 text-3xl font-black text-slate-950">
								{history.length}
							</p>
						</div>
					</div>
				</article>

				<article className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(30,41,59,0.08)] backdrop-blur-xl">
					<div className="flex items-center gap-4">
						<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
							<UserRound size={22} aria-hidden="true" />
						</span>

						<div>
							<p className="text-sm font-bold text-slate-500">
								Enfants suivis
							</p>

							<p className="mt-1 text-3xl font-black text-slate-950">
								{childrenCount}
							</p>
						</div>
					</div>
				</article>

				<article className="rounded-[24px] border border-emerald-100 bg-emerald-50/80 p-5 shadow-[0_12px_35px_rgba(30,41,59,0.06)]">
					<div className="flex items-center gap-4">
						<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
							<ShieldCheck size={22} aria-hidden="true" />
						</span>

						<div>
							<p className="text-sm font-bold text-emerald-600">
								Protection
							</p>

							<p className="mt-1 text-xl font-black text-emerald-700">
								Active
							</p>
						</div>
					</div>
				</article>
			</section>

			<section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_16px_45px_rgba(30,41,59,0.08)] backdrop-blur-xl">
				<header className="flex flex-col gap-2 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-xl font-black text-slate-950">
							Dernières recherches
						</h2>

						<p className="mt-1 text-sm text-slate-500">
							L’historique complet des recherches enregistrées.
						</p>
					</div>

					<span className="w-fit rounded-full bg-violet-100 px-3 py-1.5 text-xs font-black text-violet-700">
						{history.length} recherche{history.length > 1 ? "s" : ""}
					</span>
				</header>

				{history.length === 0 ? (
					<div className="px-6 py-14 text-center">
						<span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
							<Search size={25} aria-hidden="true" />
						</span>

						<h3 className="mt-4 text-lg font-black text-slate-900">
							Aucune recherche enregistrée
						</h3>

						<p className="mt-2 text-sm text-slate-500">
							Les recherches de vos enfants apparaîtront ici.
						</p>
					</div>
				) : (
					<>
						<div className="hidden grid-cols-[1.4fr_0.8fr_1fr_0.6fr] gap-5 bg-violet-50/80 px-6 py-4 text-sm font-black text-slate-700 md:grid">
							<span>Recherche</span>
							<span>Enfant</span>
							<span>Date</span>
							<span>Statut</span>
						</div>

						<ul>
							{history.map((item) => (
								<li
									key={item.search_history_id}
									className="grid gap-4 border-t border-slate-100 px-6 py-4 transition hover:bg-violet-50/30 md:grid-cols-[1.4fr_0.8fr_1fr_0.6fr] md:items-center md:gap-5"
								>
									<div className="flex min-w-0 items-center gap-3">
										<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
											<Search size={18} aria-hidden="true" />
										</span>

										<div className="min-w-0">
											<p className="text-xs font-bold uppercase text-slate-400 md:hidden">
												Recherche
											</p>

											<p className="truncate font-black text-slate-900">
												{item.search_query || "Recherche vide"}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<UserRound
											size={17}
											aria-hidden="true"
											className="shrink-0 text-violet-500"
										/>

										<div>
											<p className="text-xs font-bold uppercase text-slate-400 md:hidden">
												Enfant
											</p>

											<span className="font-bold text-slate-700">
												{item.first_name}
											</span>
										</div>
									</div>

									<div className="flex items-center gap-2 text-sm text-slate-500">
										<CalendarDays
											size={17}
											aria-hidden="true"
											className="shrink-0 text-slate-400"
										/>

										<div>
											<p className="text-xs font-bold uppercase text-slate-400 md:hidden">
												Date
											</p>

											<time dateTime={item.created_at}>
												{formatDate(item.created_at)}
											</time>
										</div>
									</div>

									<div>
										<p className="mb-1 text-xs font-bold uppercase text-slate-400 md:hidden">
											Statut
										</p>

										<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
											<CheckCircle2 size={15} aria-hidden="true" />
											Autorisé
										</span>
									</div>
								</li>
							))}
						</ul>
					</>
				)}
			</section>
		</main>
	);
}