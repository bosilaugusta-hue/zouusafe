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
		<article className="rounded-3xl bg-white p-6 shadow-md">
			<header className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<Search size={22} className="text-violet-600" />

					<h2 className="text-xl font-black text-violet-700">
						Recherches récentes
					</h2>
				</div>

				<Link
					href={`/child-dashboard/history?childId=${childId}`}
					className="text-sm font-black text-violet-600 hover:underline"
				>
					Voir tout
				</Link>
			</header>

			<div className="mt-5">
				{isLoading ? (
					<p className="text-center text-sm text-slate-500">Chargement...</p>
				) : history.length === 0 ? (
					<p className="text-center text-sm text-slate-500">
						Les recherches de {childName} apparaîtront ici.
					</p>
				) : (
					<ul className="space-y-3">
						{history.map((item) => (
							<li
								key={item.search_history_id}
								className="flex items-center justify-between rounded-2xl bg-violet-50 px-4 py-3"
							>
								<span className="font-semibold text-slate-800">
									{item.search_query}
								</span>

								<span className="flex items-center gap-1 text-xs text-slate-500">
									<Clock3 size={14} />
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
