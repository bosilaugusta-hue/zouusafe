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

import Sidebar from "@/components/dashboard/Sidebar";
import ParentPinCard from "@/components/parent/ParentPinCard";
import SettingsForm, {
	type Setting,
} from "@/components/settings/SettingsForm";

type SettingsResponse = {
	settings: Setting[];
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
		throw new Error(
			"Impossible de récupérer les paramètres.",
		);
	}

	const data = (await response.json()) as SettingsResponse;

	return data.settings;
}

export default async function SettingsPage() {
	const settings = await getSettings();

	const safeSearchProfiles = settings.filter(
		(setting) => setting.safe_search,
	).length;

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-6 text-slate-900">
			<section className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
				<Sidebar />

				<section className="space-y-6">
					<header className="rounded-[30px] border border-white/80 bg-white/90 p-7 shadow-xl backdrop-blur-xl">
						<div className="flex items-center gap-4">
							<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 shadow-sm">
								<Settings
									size={28}
									aria-hidden="true"
								/>
							</span>

							<div>
								<p className="text-sm font-black uppercase tracking-[0.15em] text-violet-500">
									Contrôle parental
								</p>

								<h1 className="mt-1 text-3xl font-black">
									Paramètres
								</h1>

								<p className="mt-2 text-sm text-slate-500">
									Gérez la protection, le filtrage et le
									temps d’écran de chaque enfant.
								</p>
							</div>
						</div>
					</header>

					<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						<SummaryCard
							icon={
								<SlidersHorizontal
									size={22}
									aria-hidden="true"
								/>
							}
							value={settings.length}
							title="Profils configurés"
							iconClassName="bg-violet-100 text-violet-600"
						/>

						<SummaryCard
							icon={
								<ShieldCheck
									size={22}
									aria-hidden="true"
								/>
							}
							value={safeSearchProfiles}
							title="Safe Search actif"
							iconClassName="bg-emerald-100 text-emerald-600"
						/>

						<SummaryCard
							icon={
								<UsersRound
									size={22}
									aria-hidden="true"
								/>
							}
							value={settings.length}
							title="Enfants protégés"
							iconClassName="bg-blue-100 text-blue-600"
						/>

						<SummaryCard
							icon={
								<KeyRound
									size={22}
									aria-hidden="true"
								/>
							}
							value="Sécurisé"
							title="Accès parent"
							iconClassName="bg-pink-100 text-pink-600"
						/>
					</section>

					<ParentPinCard />

					{settings.length > 0 ? (
						<section className="rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
							<div className="mb-6">
								<p className="text-sm font-black uppercase tracking-[0.14em] text-violet-500">
									Profils enfants
								</p>

								<h2 className="mt-1 text-2xl font-black">
									Réglages de protection
								</h2>

								<p className="mt-2 text-sm text-slate-500">
									Personnalisez les règles de navigation
									et le temps d’écran.
								</p>
							</div>

							<SettingsForm initialSettings={settings} />
						</section>
					) : (
						<section className="rounded-[28px] border border-dashed border-violet-200 bg-white/80 p-10 text-center shadow-lg backdrop-blur-xl">
							<span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-500">
								<Settings
									size={28}
									aria-hidden="true"
								/>
							</span>

							<h2 className="mt-4 text-2xl font-black">
								Aucun paramètre disponible
							</h2>

							<p className="mt-2 text-slate-500">
								Ajoutez d’abord un profil enfant pour
								configurer sa protection.
							</p>
						</section>
					)}

					<article className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
						<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
							<div className="flex items-start gap-4">
								<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
									<ShieldCheck
										size={24}
										aria-hidden="true"
									/>
								</span>

								<div>
									<p className="text-sm font-black uppercase tracking-[0.14em] text-violet-500">
										Bilan de sécurité
									</p>

									<h2 className="mt-1 text-xl font-black">
										Protection des profils
									</h2>

									<p className="mt-2 text-sm text-slate-500">
										Les réglages sont enregistrés et
										synchronisés avec ZouuSafe.
									</p>
								</div>
							</div>

							<ul className="grid gap-3 sm:grid-cols-2">
								<SummaryItem text="Contrôle parental actif" />
								<SummaryItem text="Accès protégé par PIN" />
								<SummaryItem text="Safe Search configurable" />
								<SummaryItem text="Paramètres synchronisés" />
							</ul>
						</div>
					</article>
				</section>
			</section>
		</main>
	);
}

function SummaryCard({
	icon,
	value,
	title,
	iconClassName,
}: {
	icon: ReactNode;
	value: number | string;
	title: string;
	iconClassName: string;
}) {
	return (
		<article className="rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
			<span
				className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClassName}`}
			>
				{icon}
			</span>

			<p className="mt-4 text-3xl font-black text-slate-900">
				{value}
			</p>

			<p className="mt-1 font-black text-slate-700">
				{title}
			</p>

			<div className="mt-4 flex items-center gap-2 text-xs font-black text-emerald-600">
				<span className="h-2 w-2 rounded-full bg-emerald-400" />
				Données actualisées
			</div>
		</article>
	);
}

function SummaryItem({ text }: { text: string }) {
	return (
		<li className="flex items-center gap-2 text-sm font-bold text-slate-600">
			<CheckCircle2
				size={18}
				aria-hidden="true"
				className="shrink-0 text-emerald-500"
			/>

			{text}
		</li>
	);
}