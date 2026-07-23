import {
	BarChart3,
	Bell,
	CheckCircle2,
	Clock3,
	Search,
	ShieldAlert,
	ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { cookies } from "next/headers";

import Sidebar from "@/components/dashboard/Sidebar";

type ReportChild = {
	child_id: number;
	first_name: string;
	avatar_url: string | null;
	searches: number;
	blocked_sites: number;
	alerts: number;
	screen_time_used: number;
	screen_time_limit: number;
};

type ReportsResponse = {
	summary: {
		searches: number;
		blockedSites: number;
		alerts: number;
		screenTimeUsed: number;
		screenTimeLimit: number;
	};
	children: ReportChild[];
};

async function getReports(): Promise<ReportsResponse> {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("zouusafe_session");

	if (!sessionCookie) {
		throw new Error("Session utilisateur introuvable.");
	}

	const response = await fetch("http://localhost:3000/api/reports", {
		cache: "no-store",
		headers: {
			Cookie: `zouusafe_session=${sessionCookie.value}`,
		},
	});

	if (!response.ok) {
		throw new Error("Impossible de récupérer les rapports.");
	}

	return response.json();
}

function getProgress(used: number, limit: number) {
	if (limit <= 0) {
		return 0;
	}

	return Math.min(100, Math.round((used / limit) * 100));
}

function getProgressColor(progress: number) {
	if (progress >= 100) {
		return "from-red-400 to-red-600";
	}

	if (progress >= 75) {
		return "from-orange-400 to-orange-500";
	}

	return "from-emerald-400 to-emerald-500";
}

export default async function ReportsPage() {
	const reports = await getReports();

	const totalProgress = getProgress(
		reports.summary.screenTimeUsed,
		reports.summary.screenTimeLimit,
	);

	const totalProgressColor = getProgressColor(totalProgress);

	const weeklyStatus =
		totalProgress >= 100
			? "La limite globale de temps d’écran a été atteinte."
			: totalProgress >= 75
				? "Le temps d’écran approche de la limite autorisée."
				: "Le temps d’écran reste dans la limite autorisée.";

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-6 text-slate-900">
			<section className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
				<Sidebar />

				<section className="space-y-6">
					<header className="rounded-[30px] border border-white/70 bg-white/90 p-7 shadow-xl backdrop-blur-xl">
						<div className="flex items-center gap-4">
							<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-yellow-100 text-orange-600 shadow-sm">
								<BarChart3 size={28} aria-hidden="true" />
							</span>

							<div>
								<p className="text-sm font-black uppercase tracking-[0.15em] text-violet-500">
									Analyse de l’activité
								</p>

								<h1 className="mt-1 text-3xl font-black">
									Rapports
								</h1>

								<p className="mt-2 text-sm text-slate-500">
									Consultez les principales données de protection de vos
									enfants.
								</p>
							</div>
						</div>
					</header>

					<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						<SummaryCard
							icon={<Search size={25} aria-hidden="true" />}
							value={reports.summary.searches}
							title="Recherches"
							description="Activité enregistrée"
							iconClassName="bg-blue-100 text-blue-600"
							lineClassName="from-blue-400 to-violet-400"
						/>

						<SummaryCard
							icon={<ShieldAlert size={25} aria-hidden="true" />}
							value={reports.summary.blockedSites}
							title="Sites bloqués"
							description="Contenus filtrés"
							iconClassName="bg-pink-100 text-pink-600"
							lineClassName="from-pink-400 to-rose-400"
						/>

						<SummaryCard
							icon={<Bell size={25} aria-hidden="true" />}
							value={reports.summary.alerts}
							title="Alertes"
							description="Événements détectés"
							iconClassName="bg-orange-100 text-orange-600"
							lineClassName="from-orange-400 to-yellow-400"
						/>

						<SummaryCard
							icon={<Clock3 size={25} aria-hidden="true" />}
							value={`${reports.summary.screenTimeUsed} min`}
							title="Temps utilisé"
							description="Aujourd’hui"
							iconClassName="bg-emerald-100 text-emerald-600"
							lineClassName="from-emerald-400 to-green-400"
						/>
					</section>

					<section className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
						<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
							<div>
								<p className="text-sm font-black uppercase tracking-[0.14em] text-violet-500">
									Suivi global
								</p>

								<h2 className="mt-1 text-2xl font-black">
									Temps d’écran global
								</h2>

								<p className="mt-2 text-sm text-slate-500">
									{reports.summary.screenTimeUsed} min utilisées sur{" "}
									{reports.summary.screenTimeLimit} min autorisées.
								</p>
							</div>

							<div className="rounded-2xl bg-violet-50 px-5 py-3 text-center">
								<p className="text-3xl font-black text-violet-600">
									{totalProgress} %
								</p>

								<p className="mt-1 text-xs font-bold text-slate-500">
									de la limite
								</p>
							</div>
						</div>

						<div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100 shadow-inner">
							<div
								className={`h-full rounded-full bg-gradient-to-r ${totalProgressColor} shadow-sm transition-all duration-500`}
								style={{ width: `${totalProgress}%` }}
							/>
						</div>

						<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
							<p className="text-sm font-semibold text-slate-600">
								{weeklyStatus}
							</p>

							<span className="rounded-full bg-violet-100 px-4 py-2 text-xs font-black text-violet-700">
								Suivi en temps réel
							</span>
						</div>
					</section>

					<section className="grid gap-5 lg:grid-cols-2">
						{reports.children.map((child) => {
							const avatar =
								child.avatar_url ?? "/avatars-profil/fille-15.png";

							const avatarSrc = avatar.startsWith("/")
								? avatar
								: `/${avatar}`;

							const progress = getProgress(
								child.screen_time_used,
								child.screen_time_limit,
							);

							const progressColor = getProgressColor(progress);

							return (
								<article
									key={child.child_id}
									className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
								>
									<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
										<div className="flex items-center gap-4">
											<div className="relative">
												<Image
													src={avatarSrc}
													alt={`Avatar de ${child.first_name}`}
													width={88}
													height={88}
													className="h-20 w-20 rounded-full border-4 border-violet-100 object-cover shadow-md"
												/>

												<span className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-4 border-white bg-emerald-400" />
											</div>

											<div>
												<h2 className="text-2xl font-black">
													{child.first_name}
												</h2>

												<div className="mt-2 flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
													<ShieldCheck
														size={14}
														aria-hidden="true"
													/>
													Protection active
												</div>

												<p className="mt-2 text-sm text-slate-500">
													Rapport individuel
												</p>
											</div>
										</div>

										<span className="rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-600">
											Profil protégé
										</span>
									</div>

									<div className="mt-6 grid grid-cols-3 gap-3">
										<div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-center">
											<div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
												<Search size={17} aria-hidden="true" />
											</div>

											<p className="mt-3 text-2xl font-black text-blue-700">
												{child.searches}
											</p>

											<p className="mt-1 text-xs font-bold text-slate-500">
												Recherches
											</p>
										</div>

										<div className="rounded-2xl border border-pink-100 bg-pink-50/70 p-4 text-center">
											<div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-pink-600 shadow-sm">
												<ShieldAlert size={17} aria-hidden="true" />
											</div>

											<p className="mt-3 text-2xl font-black text-pink-700">
												{child.blocked_sites}
											</p>

											<p className="mt-1 text-xs font-bold text-slate-500">
												Bloqués
											</p>
										</div>

										<div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4 text-center">
											<div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm">
												<Bell size={17} aria-hidden="true" />
											</div>

											<p className="mt-3 text-2xl font-black text-orange-700">
												{child.alerts}
											</p>

											<p className="mt-1 text-xs font-bold text-slate-500">
												Alertes
											</p>
										</div>
									</div>

									<section className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
										<div className="flex items-center justify-between gap-4">
											<div className="flex items-center gap-3">
												<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
													<Clock3 size={19} aria-hidden="true" />
												</span>

												<div>
													<h3 className="font-black">
														Temps d’écran
													</h3>

													<p className="mt-1 text-sm text-slate-500">
														{child.screen_time_used} min sur{" "}
														{child.screen_time_limit} min
													</p>
												</div>
											</div>

											<strong className="text-xl font-black text-emerald-700">
												{progress} %
											</strong>
										</div>

										<div className="mt-4 h-3 overflow-hidden rounded-full bg-white shadow-inner">
											<div
												className={`h-full rounded-full bg-gradient-to-r ${progressColor} shadow-sm transition-all duration-500`}
												style={{ width: `${progress}%` }}
											/>
										</div>
									</section>
								</article>
							);
						})}
					</section>

					<article className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
						<div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
							<div className="flex items-start gap-4">
								<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-600 shadow-sm">
									<ShieldCheck size={27} aria-hidden="true" />
								</span>

								<div>
									<p className="text-sm font-black uppercase tracking-[0.14em] text-violet-500">
										Bilan général
									</p>

									<h2 className="mt-1 text-2xl font-black">
										Résumé de l’activité
									</h2>

									<p className="mt-2 text-sm text-slate-500">
										Les données principales de protection sont à jour.
									</p>
								</div>
							</div>

							<ul className="grid gap-3 sm:grid-cols-2">
								<SummaryItem
									text={`${reports.summary.searches} recherches enregistrées`}
								/>

								<SummaryItem
									text={`${reports.summary.blockedSites} sites bloqués`}
								/>

								<SummaryItem
									text={`${reports.summary.alerts} alertes détectées`}
								/>

								<SummaryItem text={weeklyStatus} />
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
	description,
	iconClassName,
	lineClassName,
}: {
	icon: React.ReactNode;
	value: number | string;
	title: string;
	description: string;
	iconClassName: string;
	lineClassName: string;
}) {
	return (
		<article className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl">
			<div
				className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm ${iconClassName}`}
			>
				{icon}
			</div>

			<p className="mt-4 text-3xl font-black text-slate-900">
				{value}
			</p>

			<p className="mt-1 font-black text-slate-800">
				{title}
			</p>

			<p className="mt-1 text-xs font-semibold text-slate-500">
				{description}
			</p>

			<div
				className={`mt-5 h-1 w-12 rounded-full bg-gradient-to-r ${lineClassName}`}
			/>

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
				size={18}
				aria-hidden="true"
				className="shrink-0 text-emerald-500"
			/>

			{text}
		</li>
	);
}