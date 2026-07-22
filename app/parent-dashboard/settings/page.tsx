import {
	Clock3,
	Save,
	SearchCheck,
	Settings,
	ShieldCheck,
} from "lucide-react";
import { cookies } from "next/headers";

import Sidebar from "@/components/dashboard/Sidebar";

type Setting = {
	child_id: number;
	first_name: string;
	screen_time_limit: number;
	screen_time_used: number;
	filter_level: string;
	safe_search: boolean;
};

type SettingsResponse = {
	settings: Setting[];
};

async function getSettings(): Promise<Setting[]> {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("zouusafe_session");

	if (!sessionCookie) {
		throw new Error("Session utilisateur introuvable.");
	}

	const response = await fetch(
		"http://localhost:3000/api/settings",
		{
			cache: "no-store",
			headers: {
				Cookie: `zouusafe_session=${sessionCookie.value}`,
			},
		},
	);

	if (!response.ok) {
		throw new Error(
			"Impossible de récupérer les paramètres.",
		);
	}

	const data = (await response.json()) as SettingsResponse;

	return data.settings;
}

export default async function SettingsPage() {
	const settings = await getSettings();

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-6 text-slate-900">
			<section className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
				<Sidebar />

				<section className="space-y-6">
					<header className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-xl backdrop-blur-xl">
						<div className="flex items-center gap-4">
							<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
								<Settings size={28} />
							</span>

							<div>
								<p className="text-sm font-black uppercase tracking-[0.15em] text-violet-500">
									Contrôle parental
								</p>

								<h1 className="mt-1 text-3xl font-black">
									Paramètres
								</h1>

								<p className="mt-2 text-sm text-slate-500">
									Gérez la protection, le filtrage et le temps d’écran.
								</p>
							</div>
						</div>
					</header>

					<section className="grid gap-5">
						{settings.map((setting) => (
							<article
								key={setting.child_id}
								className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-xl backdrop-blur-xl"
							>
								<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
									<div>
										<p className="text-sm font-black uppercase tracking-[0.14em] text-violet-500">
											Profil enfant
										</p>

										<h2 className="mt-1 text-2xl font-black">
											{setting.first_name}
										</h2>

										<p className="mt-1 text-sm text-slate-500">
											Personnalisez les règles de protection.
										</p>
									</div>

									<span className="inline-flex w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
										Protection active
									</span>
								</div>

								<div className="mt-6 grid gap-5 lg:grid-cols-3">
									<section className="rounded-3xl border border-violet-100 bg-violet-50 p-5">
										<div className="flex items-center gap-3">
											<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
												<ShieldCheck size={22} />
											</span>

											<div>
												<h3 className="font-black">
													Niveau de filtrage
												</h3>

												<p className="mt-1 text-sm text-slate-500">
													Protection des contenus
												</p>
											</div>
										</div>

										<div className="mt-5 space-y-3">
											<label className="flex cursor-pointer items-center justify-between rounded-2xl bg-white px-4 py-3">
												<div>
													<p className="font-black">
														Standard
													</p>

													<p className="text-xs text-slate-500">
														Protection équilibrée
													</p>
												</div>

												<input
													type="radio"
													name={`filter-${setting.child_id}`}
													defaultChecked={
														setting.filter_level ===
														"standard"
													}
												/>
											</label>

											<label className="flex cursor-pointer items-center justify-between rounded-2xl bg-white px-4 py-3">
												<div>
													<p className="font-black">
														Strict
													</p>

													<p className="text-xs text-slate-500">
														Filtrage renforcé
													</p>
												</div>

												<input
													type="radio"
													name={`filter-${setting.child_id}`}
													defaultChecked={
														setting.filter_level ===
														"strict"
													}
												/>
											</label>
										</div>
									</section>

									<section className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
										<div className="flex items-center gap-3">
											<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
												<SearchCheck size={22} />
											</span>

											<div>
												<h3 className="font-black">
													Safe Search
												</h3>

												<p className="mt-1 text-sm text-slate-500">
													Recherche sécurisée
												</p>
											</div>
										</div>

										<div className="mt-5 rounded-2xl bg-white px-4 py-4">
											<div className="flex items-center justify-between gap-4">
												<div>
													<p className="font-black">
														Activer Safe Search
													</p>

													<p className="mt-1 text-xs text-slate-500">
														Filtre les résultats sensibles
													</p>
												</div>

												<span
													className={`relative h-7 w-12 rounded-full ${
														setting.safe_search
															? "bg-violet-600"
															: "bg-slate-300"
													}`}
												>
													<span
														className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
															setting.safe_search
																? "left-6"
																: "left-1"
														}`}
													/>
												</span>
											</div>
										</div>
									</section>

									<section className="rounded-3xl border border-green-100 bg-green-50 p-5">
										<div className="flex items-center gap-3">
											<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-600">
												<Clock3 size={22} />
											</span>

											<div>
												<h3 className="font-black">
													Limite quotidienne
												</h3>

												<p className="mt-1 text-sm text-slate-500">
													Temps d’écran autorisé
												</p>
											</div>
										</div>

										<div className="mt-5 rounded-2xl bg-white p-4">
											<label
												htmlFor={`limit-${setting.child_id}`}
												className="text-sm font-black text-slate-700"
											>
												Minutes par jour
											</label>

											<input
												id={`limit-${setting.child_id}`}
												type="number"
												min="15"
												max="600"
												step="15"
												defaultValue={
													setting.screen_time_limit
												}
												className="mt-3 min-h-12 w-full rounded-xl border border-slate-200 px-4 font-black outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
											/>

											<p className="mt-2 text-xs text-slate-500">
												Temps utilisé aujourd’hui :{" "}
												{setting.screen_time_used} min
											</p>
										</div>
									</section>
								</div>

								<div className="mt-6 flex justify-end">
									<button
										type="button"
										className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
									>
										<Save size={19} />
										Enregistrer les modifications
									</button>
								</div>
							</article>
						))}
					</section>

					{settings.length === 0 && (
						<section className="rounded-[28px] border border-dashed border-violet-200 bg-white/80 p-10 text-center shadow-lg">
							<Settings
								size={42}
								className="mx-auto text-slate-300"
							/>

							<h2 className="mt-4 text-2xl font-black">
								Aucun paramètre disponible
							</h2>

							<p className="mt-2 text-slate-500">
								Ajoutez d’abord un profil enfant.
							</p>
						</section>
					)}
				</section>
			</section>
		</main>
	);
}