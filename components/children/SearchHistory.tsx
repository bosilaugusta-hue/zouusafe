"use client";

import { Clock3, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type SearchHistoryItem = {
	search_history_id: number;
	search_query: string;
	created_at: string;
};

type SearchHistoryProps = {
	childId: number;
	childName: string;
};

export default function SearchHistory({
	childId,
	childName,
}: SearchHistoryProps) {
	const [history, setHistory] = useState<SearchHistoryItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadHistory() {
			try {
				const response = await fetch(`/api/search-history?childId=${childId}`, {
					cache: "no-store",
				});

				if (!response.ok) {
					throw new Error();
				}

				const data = (await response.json()) as {
					history: SearchHistoryItem[];
				};

				setHistory(data.history.slice(0, 4));
			} catch (error) {
				console.error("Impossible de charger les recherches :", error);
			} finally {
				setIsLoading(false);
			}
		}

		loadHistory();
	}, [childId]);

	function formatTime(date: string) {
		return new Intl.DateTimeFormat("fr-FR", {
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(date));
	}

	return (
		<article className="h-full min-h-[330px] rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_14px_40px_rgba(30,41,59,0.10)] backdrop-blur-xl">
			<header className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-2.5">
					<Search
						size={21}
						aria-hidden="true"
						className="text-violet-600"
					/>

					<h2 className="text-xl font-black text-violet-700">
						Recherches récentes
					</h2>
				</div>

				<Link
					href={`/child-dashboard/history?childId=${childId}`}
					className="shrink-0 text-xs font-black text-violet-600 transition hover:text-violet-800"
				>
					Voir tout
				</Link>
			</header>

			<div className="mt-5">
				{isLoading ? (
					<p className="py-10 text-center text-sm font-semibold text-slate-400">
						Chargement...
					</p>
				) : history.length === 0 ? (
					<p className="py-10 text-center text-sm font-semibold text-slate-400">
						Les recherches de {childName} apparaîtront ici.
					</p>
				) : (
					<ul className="space-y-3">
						{history.map((item) => (
							<li
								key={item.search_history_id}
								className="flex items-center justify-between gap-3 rounded-2xl bg-violet-50/90 px-4 py-3 transition hover:bg-violet-100/80"
							>
								<span className="min-w-0 truncate text-sm font-bold text-slate-800">
									{item.search_query}
								</span>

								<span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-500">
									<Clock3 size={13} aria-hidden="true" />
									{formatTime(item.created_at)}
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</article>
	);
}