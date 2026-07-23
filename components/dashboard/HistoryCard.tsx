import { Clock3, Search } from "lucide-react";

type HistoryItem = {
	search_history_id: number;
	search_query: string;
	created_at: string;
};

type HistoryCardProps = {
	history: HistoryItem[];
};

export default function HistoryCard({
	history,
}: HistoryCardProps) {
	function formatDate(date: string) {
		return new Intl.DateTimeFormat("fr-FR", {
			day: "2-digit",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(date));
	}

	return (
		<section className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
			<header className="flex items-center justify-between gap-4">
				<div>
					<p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-500">
						Activité récente
					</p>

					<h2 className="mt-1 text-2xl font-black text-slate-900">
						Historique des recherches
					</h2>
				</div>

				<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-600 shadow-sm">
					<Search size={22} aria-hidden="true" />
				</div>
			</header>

			<div className="mt-6">
				{history.length === 0 ? (
					<section className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 px-5 py-8 text-center">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-violet-500 shadow-sm">
							<Search size={22} aria-hidden="true" />
						</div>

						<h3 className="mt-4 font-black text-slate-900">
							Aucune recherche récente
						</h3>

						<p className="mt-2 text-sm leading-6 text-slate-500">
							Les recherches de vos enfants apparaîtront ici.
						</p>
					</section>
				) : (
					<ul className="space-y-3">
						{history.map((item) => (
							<li
								key={item.search_history_id}
								className="flex items-center justify-between gap-4 rounded-2xl border border-violet-50 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-100 hover:shadow-md"
							>
								<div className="flex min-w-0 items-center gap-4">
									<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
										<Search size={19} aria-hidden="true" />
									</div>

									<div className="min-w-0">
										<p className="truncate text-base font-black text-slate-900">
											{item.search_query || "Recherche vide"}
										</p>

										<p className="mt-1 text-sm font-semibold text-slate-500">
											Recherche effectuée
										</p>
									</div>
								</div>

								<div className="flex shrink-0 items-center gap-2 text-xs font-bold text-slate-500">
									<Clock3
										size={16}
										aria-hidden="true"
										className="text-violet-500"
									/>

									<time dateTime={item.created_at}>
										{formatDate(item.created_at)}
									</time>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
}