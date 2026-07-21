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
		<section className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_50px_rgba(88,80,150,0.10)] backdrop-blur-xl">
			<div className="flex items-center justify-between gap-4">
				<div>
					<p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-500">
						Activité récente
					</p>

					<h2 className="mt-1 text-2xl font-black text-slate-900">
						Historique des recherches
					</h2>
				</div>

				<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
					<Search size={22} aria-hidden="true" />
				</div>
			</div>

			<div className="mt-6">
				{history.length === 0 ? (
					<p className="rounded-2xl bg-slate-50 p-5 text-center text-sm font-semibold text-slate-500">
						Aucune recherche enregistrée pour le moment.
					</p>
				) : (
					<ul className="space-y-3">
						{history.map((item) => (
							<li
								key={item.search_history_id}
								className="flex items-center justify-between gap-4 rounded-2xl border border-violet-50 bg-white p-4 shadow-sm"
							>
								<div className="min-w-0">
									<p className="text-sm font-semibold text-slate-500">
										Recherche effectuée
									</p>

									<p className="mt-1 truncate text-base font-black text-slate-900">
										« {item.search_query} »
									</p>
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