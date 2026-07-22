import {
	CalendarDays,
	CheckCircle2,
	Search,
	UserRound,
} from "lucide-react";
import { cookies } from "next/headers";

import Sidebar from "@/components/dashboard/Sidebar";

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

	const response = await fetch(
		"http://localhost:3000/api/history",
		{
			cache: "no-store",
			headers: {
				Cookie: `zouusafe_session=${sessionCookie.value}`,
			},
		},
	);

	if (!response.ok) {
		throw new Error(
			"Impossible de récupérer l’historique.",
		);
	}

	const data = (await response.json()) as HistoryResponse;

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

export default async function HistoryPage() {
	const history = await getHistory();

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-6 text-slate-900">
			<section className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
				<Sidebar />

				<section className="space-y-6">
					<header className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-xl backdrop-blur-xl">
						<div className="flex items-center gap-4">
							<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
								<Search size={28} />
							</span>

							<div>
								<p className="text-sm font-black uppercase tracking-[0.15em] text-violet-500">
									Activité des enfants
								</p>

								<h1 className="mt-1 text-3xl font-black">
									Historique des recherches
								</h1>

								<p className="mt-2 text-sm text-slate-500">
									Consultez les recherches effectuées par Zoé et Zaïre.
								</p>
							</div>
						</div>
					</header>

					<section className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
						<div className="grid gap-4 sm:grid-cols-3">
							<div className="rounded-2xl bg-violet-50 p-4">
								<p className="text-sm font-bold text-slate-500">
									Total des recherches
								</p>

								<p className="mt-2 text-3xl font-black text-violet-700">
									{history.length}
								</p>
							</div>

							<div className="rounded-2xl bg-blue-50 p-4">
								<p className="text-sm font-bold text-slate-500">
									Enfants suivis
								</p>

								<p className="mt-2 text-3xl font-black text-blue-700">
									2
								</p>
							</div>

							<div className="rounded-2xl bg-green-50 p-4">
								<p className="text-sm font-bold text-slate-500">
									Protection
								</p>

								<p className="mt-2 text-lg font-black text-green-700">
									Active
								</p>
							</div>
						</div>

						<div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
							<div className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-4 bg-violet-50 px-5 py-4 text-sm font-black text-slate-700">
								<span>Recherche</span>
								<span>Enfant</span>
								<span>Date</span>
								<span>Statut</span>
							</div>

							{history.length === 0 ? (
								<div className="p-10 text-center">
									<Search
										size={42}
										className="mx-auto text-slate-300"
									/>

									<p className="mt-4 font-bold text-slate-500">
										Aucune recherche enregistrée.
									</p>
								</div>
							) : (
								<ul>
									{history.map((item) => (
										<li
											key={item.search_history_id}
											className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-4 border-t border-slate-100 px-5 py-4"
										>
											<div className="flex items-center gap-3">
												<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
													<Search size={17} />
												</span>

												<p className="font-black text-slate-900">
													{item.search_query}
												</p>
											</div>

											<div className="flex items-center gap-2">
												<UserRound
													size={17}
													className="text-violet-500"
												/>

												<span className="font-bold text-slate-700">
													{item.first_name}
												</span>
											</div>

											<div className="flex items-center gap-2 text-sm text-slate-500">
												<CalendarDays
													size={17}
													className="text-slate-400"
												/>

												{formatDate(item.created_at)}
											</div>

											<div>
												<span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-black text-green-700">
													<CheckCircle2 size={16} />
													Autorisé
												</span>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					</section>
				</section>
			</section>
		</main>
	);
}