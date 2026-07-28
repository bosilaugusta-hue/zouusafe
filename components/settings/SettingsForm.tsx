"use client";

import { Clock3, Save, SearchCheck, ShieldCheck } from "lucide-react";
import { useState } from "react";

export type Setting = {
	child_id: number;
	first_name: string;
	screen_time_limit: number;
	screen_time_used: number;
	filter_level: string;
	safe_search: boolean;
};

type SettingsFormProps = {
	initialSettings: Setting[];
};

type ApiResponse = {
	message?: string;
};

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
	const [settings, setSettings] = useState<Setting[]>(initialSettings);

	const [loadingChildId, setLoadingChildId] = useState<number | null>(null);

	const [successMessages, setSuccessMessages] = useState<
		Record<number, string>
	>({});

	const [errorMessages, setErrorMessages] = useState<Record<number, string>>(
		{},
	);

	function updateSetting(
		childId: number,
		field: "filter_level" | "safe_search" | "screen_time_limit",
		value: string | boolean | number,
	) {
		setSettings((currentSettings) =>
			currentSettings.map((setting) =>
				setting.child_id === childId
					? {
							...setting,
							[field]: value,
						}
					: setting,
			),
		);

		setSuccessMessages((current) => ({
			...current,
			[childId]: "",
		}));

		setErrorMessages((current) => ({
			...current,
			[childId]: "",
		}));
	}

	async function saveSetting(setting: Setting) {
		try {
			setLoadingChildId(setting.child_id);

			setSuccessMessages((current) => ({
				...current,
				[setting.child_id]: "",
			}));

			setErrorMessages((current) => ({
				...current,
				[setting.child_id]: "",
			}));

			const response = await fetch("/api/settings", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					childId: setting.child_id,
					screenTimeLimit: setting.screen_time_limit,
					filterLevel: setting.filter_level,
					safeSearch: setting.safe_search,
				}),
			});

			const data = (await response.json().catch(() => ({}))) as ApiResponse;

			if (!response.ok) {
				setErrorMessages((current) => ({
					...current,
					[setting.child_id]:
						data.message ?? "Impossible d’enregistrer les paramètres.",
				}));

				return;
			}

			setSuccessMessages((current) => ({
				...current,
				[setting.child_id]:
					data.message ?? "Les paramètres ont bien été enregistrés.",
			}));
		} catch (error) {
			console.error("Erreur pendant l’enregistrement :", error);

			setErrorMessages((current) => ({
				...current,
				[setting.child_id]:
					"Une erreur est survenue. Réessaie dans quelques instants.",
			}));
		} finally {
			setLoadingChildId(null);
		}
	}

	if (settings.length === 0) {
		return null;
	}

	return (
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

							<h2 className="mt-1 text-2xl font-black">{setting.first_name}</h2>

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
									<h3 className="font-black">Niveau de filtrage</h3>

									<p className="mt-1 text-sm text-slate-500">
										Protection des contenus
									</p>
								</div>
							</div>

							<div className="mt-5 space-y-3">
								<label className="flex cursor-pointer items-center justify-between rounded-2xl bg-white px-4 py-3">
									<div>
										<p className="font-black">Standard</p>

										<p className="text-xs text-slate-500">
											Protection équilibrée
										</p>
									</div>

									<input
										type="radio"
										name={`filter-${setting.child_id}`}
										checked={setting.filter_level === "standard"}
										onChange={() =>
											updateSetting(
												setting.child_id,
												"filter_level",
												"standard",
											)
										}
									/>
								</label>

								<label className="flex cursor-pointer items-center justify-between rounded-2xl bg-white px-4 py-3">
									<div>
										<p className="font-black">Strict</p>

										<p className="text-xs text-slate-500">Filtrage renforcé</p>
									</div>

									<input
										type="radio"
										name={`filter-${setting.child_id}`}
										checked={setting.filter_level === "strict"}
										onChange={() =>
											updateSetting(setting.child_id, "filter_level", "strict")
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
									<h3 className="font-black">Safe Search</h3>

									<p className="mt-1 text-sm text-slate-500">
										Recherche sécurisée
									</p>
								</div>
							</div>

							<div className="mt-5 rounded-2xl bg-white px-4 py-4">
								<div className="flex items-center justify-between gap-4">
									<div>
										<p className="font-black">Activer Safe Search</p>

										<p className="mt-1 text-xs text-slate-500">
											Filtre les résultats sensibles
										</p>
									</div>

									<button
										type="button"
										role="switch"
										aria-checked={setting.safe_search}
										aria-label={`Safe Search pour ${setting.first_name}`}
										onClick={() =>
											updateSetting(
												setting.child_id,
												"safe_search",
												!setting.safe_search,
											)
										}
										className={`relative h-7 w-12 shrink-0 rounded-full transition ${
											setting.safe_search ? "bg-violet-600" : "bg-slate-300"
										}`}
									>
										<span
											className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
												setting.safe_search ? "left-6" : "left-1"
											}`}
										/>
									</button>
								</div>
							</div>
						</section>

						<section className="rounded-3xl border border-green-100 bg-green-50 p-5">
							<div className="flex items-center gap-3">
								<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-600">
									<Clock3 size={22} />
								</span>

								<div>
									<h3 className="font-black">Limite quotidienne</h3>

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
									min={15}
									max={600}
									step={15}
									value={setting.screen_time_limit}
									onChange={(event) =>
										updateSetting(
											setting.child_id,
											"screen_time_limit",
											Number(event.target.value),
										)
									}
									className="mt-3 min-h-12 w-full rounded-xl border border-slate-200 px-4 font-black outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
								/>

								<p className="mt-2 text-xs text-slate-500">
									Temps utilisé aujourd’hui : {setting.screen_time_used} min
								</p>
							</div>
						</section>
					</div>

					{errorMessages[setting.child_id] && (
						<p
							role="alert"
							className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600"
						>
							{errorMessages[setting.child_id]}
						</p>
					)}

					{successMessages[setting.child_id] && (
						<p
							role="status"
							className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700"
						>
							✓ {successMessages[setting.child_id]}
						</p>
					)}

					<div className="mt-6 flex justify-end">
						<button
							type="button"
							disabled={loadingChildId === setting.child_id}
							onClick={() => saveSetting(setting)}
							className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
						>
							<Save size={19} />

							{loadingChildId === setting.child_id
								? "Enregistrement..."
								: "Enregistrer les modifications"}
						</button>
					</div>
				</article>
			))}
		</section>
	);
}
