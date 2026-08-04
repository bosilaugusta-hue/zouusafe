import {
	CheckCircle2,
	KeyRound,
	Settings,
	ShieldCheck,
	SlidersHorizontal,
	UsersRound,
} from "lucide-react";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

import ParentPinCard from "@/components/parent/ParentPinCard";
import SettingsForm, { type Setting } from "@/components/settings/SettingsForm";

type SettingsResponse = {
	settings: Setting[];
};

type SummaryCardProps = {
	icon: ReactNode;
	value: number | string;
	title: string;
	description: string;
	iconClassName: string;
	progressClassName: string;
	progressWidth: string;
};

async function getSettings(): Promise<Setting[]> {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("zouusafe_session");

	if (!sessionCookie) {
		throw new Error("Session utilisateur introuvable.");
	}

	const response = await fetch("http://localhost:3000/api/settings", {
		cache: "no-store",
		headers: {
			Cookie: `zouusafe_session=${sessionCookie.value}`,
		},
	});

	if (!response.ok) {
		throw new Error("Impossible de récupérer les paramètres.");
	}

	const data = (await response.json()) as SettingsResponse;

	return data.settings;
}

export default async function SettingsPage() {
	const settings = await getSettings();

	const safeSearchProfiles = settings.filter(
		(setting) => setting.safe_search,
	).length;

	const safeSearchActiveForAll =
		settings.length > 0 && safeSearchProfiles === settings.length;

	return (
		<main className="space-y-6">
			<header className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(91,33,182,0.1)] backdrop-blur-xl">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-4">
						<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 shadow-sm">
							<Settings size={27} aria-hidden="true" />
						</span>

						<div>
							<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
								Contrôle parental
							</p>

							<h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
								Paramètres
							</h1>

							<p className="mt-1.5 text-sm leading-5 text-slate-500">
								Gérez la protection, le filtrage et le temps d’écran de chaque
								enfant.
							</p>
						</div>
					</div>

					<span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700">
						<span className="h-2 w-2 rounded-full bg-emerald-500" />
						Protection active
					</span>
				</div>
			</header>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<SummaryCard
					icon={<SlidersHorizontal size={22} aria-hidden="true" />}
					value={settings.length}
					title="Profils configurés"
					description="Réglages disponibles"
					iconClassName="bg-violet-100 text-violet-600"
					progressClassName="bg-gradient-to-r from-violet-500 to-indigo-400"
					progressWidth="w-4/5"
				/>

				<SummaryCard
					icon={<ShieldCheck size={22} aria-hidden="true" />}
					value={safeSearchProfiles}
					title="Safe Search actif"
					description="Profils sécurisés"
					iconClassName="bg-emerald-100 text-emerald-600"
					progressClassName="bg-gradient-to-r from-emerald-500 to-green-400"
					progressWidth={
						settings.length > 0
							? `w-[${Math.round(
									(safeSearchProfiles / settings.length) * 100,
								)}%]`
							: "w-0"
					}
				/>

				<SummaryCard
					icon={<UsersRound size={22} aria-hidden="true" />}
					value={settings.length}
					title="Enfants protégés"
					description="Profils associés"
					iconClassName="bg-blue-100 text-blue-600"
					progressClassName="bg-gradient-to-r from-blue-500 to-cyan-400"
					progressWidth="w-3/4"
				/>

				<SummaryCard
					icon={<KeyRound size={22} aria-hidden="true" />}
					value="Sécurisé"
					title="Accès parent"
					description="Protection par code PIN"
					iconClassName="bg-pink-100 text-pink-600"
					progressClassName="bg-gradient-to-r from-pink-500 to-rose-400"
					progressWidth="w-full"
				/>
			</section>

			<section className="rounded-[28px] border border-white/80 bg-white/90 p-2 shadow-[0_16px_42px_rgba(30,41,59,0.08)] backdrop-blur-xl">
				<ParentPinCard />
			</section>

			{settings.length > 0 ? (
				<section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_16px_45px_rgba(30,41,59,0.08)] backdrop-blur-xl">
					<header className="border-b border-violet-100 bg-gradient-to-r from-violet-50/80 via-white to-blue-50/70 px-6 py-5">
						<div className="flex items-start gap-4">
							<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 shadow-sm">
								<SlidersHorizontal size={23} aria-hidden="true" />
							</span>

							<div>
								<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
									Profils enfants
								</p>

								<h2 className="mt-1 text-2xl font-black text-slate-950">
									Réglages de protection
								</h2>

								<p className="mt-1.5 text-sm leading-5 text-slate-500">
									Personnalisez les règles de navigation, Safe Search et le
									temps d’écran.
								</p>
							</div>
						</div>
					</header>

					<div className="p-5 md:p-6">
						<SettingsForm initialSettings={settings} />
					</div>
				</section>
			) : (
				<section className="rounded-[28px] border border-dashed border-violet-200 bg-white/80 p-10 text-center shadow-lg backdrop-blur-xl">
					<span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-500">
						<Settings size={28} aria-hidden="true" />
					</span>

					<h2 className="mt-4 text-2xl font-black text-slate-950">
						Aucun paramètre disponible
					</h2>

					<p className="mt-2 text-slate-500">
						Ajoutez d’abord un profil enfant pour configurer sa protection.
					</p>
				</section>
			)}

			<section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
				<article className="rounded-[28px] border border-emerald-100 bg-emerald-50/80 p-6 shadow-[0_16px_42px_rgba(30,41,59,0.06)]">
					<div className="flex items-start gap-4">
						<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
							<ShieldCheck size={24} aria-hidden="true" />
						</span>

						<div>
							<p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
								État de la sécurité
							</p>

							<h2 className="mt-1 text-xl font-black text-slate-950">
								Protection des profils
							</h2>

							<p className="mt-1.5 text-sm leading-5 text-slate-600">
								Les réglages sont enregistrés et synchronisés avec ZouuSafe.
							</p>
						</div>
					</div>

					<div className="mt-5 rounded-2xl bg-white/80 p-4">
						<p className="text-sm font-bold text-slate-500">
							État de Safe Search
						</p>

						<p className="mt-1 text-lg font-black text-emerald-700">
							{safeSearchActiveForAll
								? "Actif sur tous les profils"
								: `${safeSearchProfiles} profil${
										safeSearchProfiles > 1 ? "s" : ""
									} protégé${safeSearchProfiles > 1 ? "s" : ""}`}
						</p>
					</div>
				</article>

				<article className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_42px_rgba(30,41,59,0.08)] backdrop-blur-xl">
					<div>
						<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
							Bilan de sécurité
						</p>

						<h2 className="mt-1 text-xl font-black text-slate-950">
							Configuration ZouuSafe
						</h2>

						<p className="mt-1.5 text-sm text-slate-500">
							Les principales protections sont disponibles pour chaque profil.
						</p>
					</div>

					<ul className="mt-5 grid gap-3 sm:grid-cols-2">
						<SummaryItem text="Contrôle parental actif" />
						<SummaryItem text="Accès protégé par PIN" />
						<SummaryItem text="Safe Search configurable" />
						<SummaryItem text="Temps d’écran personnalisé" />
						<SummaryItem text="Filtrage web configurable" />
						<SummaryItem text="Paramètres synchronisés" />
					</ul>
				</article>
			</section>
		</main>
	);
}

function SummaryCard({
	icon,
	value,
	title,
	description,
	iconClassName,
	progressClassName,
	progressWidth,
}: SummaryCardProps) {
	return (
		<article className="rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(30,41,59,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(91,33,182,0.13)]">
			<span
				className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClassName}`}
			>
				{icon}
			</span>

			<p className="mt-4 text-3xl font-black leading-none text-slate-950">
				{value}
			</p>

			<h2 className="mt-2 font-black text-slate-900">{title}</h2>

			<p className="mt-1 text-xs font-medium text-slate-500">
				{description}
			</p>

			<div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
				<div
					className={`h-full rounded-full ${progressClassName} ${progressWidth}`}
				/>
			</div>

			<div className="mt-3 flex items-center gap-2 text-xs font-black text-emerald-600">
				<span className="h-2 w-2 rounded-full bg-emerald-400" />
				Données actualisées
			</div>
		</article>
	);
}

function SummaryItem({ text }: { text: string }) {
	return (
		<li className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm font-bold text-slate-700">
			<CheckCircle2
				size={17}
				aria-hidden="true"
				className="shrink-0 text-emerald-500"
			/>

			{text}
		</li>
	);
}