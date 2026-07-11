import { Clock3, Search } from "lucide-react";

type SearchHistory = {
	search_history_id: number;
	search_query: string;
	created_at: string;
};

type HistoryCardProps = {
	history: SearchHistory[];
};

export default function HistoryCard({ history }: HistoryCardProps) {
	return (
		<article className="rounded-3xl bg-white/95 p-6 shadow-xl">
			<div className="mb-5 flex items-center justify-between">
				<h2 className="text-2xl font-black">Historique récent</h2>

				<button type="button" className="text-sm font-bold text-violet-600">
					Voir tout
				</button>
			</div>

			<ul className="space-y-4">
				{history.map((item) => (
					<li
						key={item.search_history_id}
						className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
					>
						<span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
							<Search size={22} />
						</span>

						<div className="flex-1">
							<p className="font-bold">Zoé a recherché : {item.search_query}</p>

							<p className="mt-1 text-sm text-slate-500">Recherche sécurisée</p>
						</div>

						<span className="flex items-center gap-1 text-sm text-slate-500">
							<Clock3 size={14} />
							{new Date(item.created_at).toLocaleTimeString("fr-FR", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</span>
					</li>
				))}
			</ul>
		</article>
	);
}
