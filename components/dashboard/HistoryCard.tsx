import { Clock3, Search } from "lucide-react";
import Link from "next/link";

type HistoryItem = {
	search_history_id: number;
	search_query: string;
	created_at: string;
};

type HistoryCardProps = {
	history: HistoryItem[];
};

function formatDate(date: string) {
	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) {
		return "Date indisponible";
	}

	return new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	}).format(parsedDate);
}

export default function HistoryCard({ history }: HistoryCardProps) {
	return (
		<section className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_16px_42px_rgba(30,41,59,0.08)] backdrop-blur-xl">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
						Activité récente
					</p>

					<h2 className="mt-1 text-xl font-black text-slate-900">
						Historique des recherches
					</h2>

					<p className="mt-1.5 text-sm leading-5 text-slate-500">
						Consultez les dernières recherches effectuées par vos enfants.
					</p>
				</div>

				<Link
					href="/parent-dashboard/history"
					className="inline-flex items-center justify-center rounded-2xl bg-violet-50 px-4 py-2.5 text-sm font-black text-violet-700 transition hover:bg-violet-100"
				>
					Voir tout
					<span aria-hidden="true" className="ml-1">
						→
					</span>
				</Link>
			</header>

			<div className="mt-5">
				{history.length === 0 ? (
					<section className="rounded-[24px] border border-dashed border-violet-200 bg-violet-50/50 px-5 py-8 text-center">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
							<Search size={22} aria-hidden="true" />
						</div>

						<h3 className="mt-3 text-lg font-black text-slate-900">
							Aucune recherche récente
						</h3>

						<p className="mt-1.5 text-sm leading-5 text-slate-500">
							Les recherches de vos enfants apparaîtront ici.
						</p>
					</section>
				) : (
					<ul className="relative space-y-3">
						<div
							aria-hidden="true"
							className="absolute bottom-5 left-[19px] top-5 hidden w-px bg-violet-200 sm:block"
						/>

						{history.map((item) => (
							<li
								key={item.search_history_id}
								className="group relative rounded-[20px] border border-violet-50 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-100 hover:shadow-md"
							>
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<div className="flex min-w-0 items-center gap-3">
										<div className="relative shrink-0">
											<div
												aria-hidden="true"
												className="absolute inset-1 rounded-full bg-violet-200/60 blur-md"
											/>

											<div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 shadow-sm ring-4 ring-white transition-transform duration-300 group-hover:scale-105">
												<Search size={17} aria-hidden="true" />
											</div>
										</div>

										<div className="min-w-0">
											<p className="truncate text-sm font-black text-slate-900">
												{item.search_query || "Recherche vide"}
											</p>

											<p className="mt-0.5 text-xs font-medium text-slate-500">
												Recherche effectuée
											</p>
										</div>
									</div>

									<p className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-slate-500 sm:justify-end">
										<Clock3
											size={14}
											aria-hidden="true"
											className="text-violet-500"
										/>

										<time dateTime={item.created_at}>
											{formatDate(item.created_at)}
										</time>
									</p>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
}