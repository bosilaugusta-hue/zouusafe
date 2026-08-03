import {
	BarChart3,
	Bell,
	CheckCircle2,
	Clock3,
	Search,
	ShieldAlert,
	ShieldCheck,
} from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";

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

function getAvatarPath(avatarUrl: string | null) {
	if (!avatarUrl) {
		return "/avatars-profil/fille-15.png";
	}

	return avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`;
}

export default async function ReportsPage() {
	const reports = await getReports();

	const totalProgress = getProgress(
		reports.summary.screenTimeUsed,
		reports.summary.screenTimeLimit,
	);

	const totalProgressColor = getProgressColor(totalProgress);

	const globalStatus =
		totalProgress >= 100
			? "La limite globale de temps d’écran a été atteinte."
			: totalProgress >= 75
				? "Le temps d’écran approche de la limite autorisée."
				: "Le temps d’écran reste dans la limite autorisée.";

	return (
		<main className="space-y-6">
			<header className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(91,33,182,0.1)] backdrop-blur-xl">
				<div className="flex items-center gap-4">
					<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm">
						<BarChart3 size={27} aria-hidden="true" />
					</span>

					<div>
						<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
							Analyse de l’activité
						</p>

						<h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
							Rapports
						</h1>

						<p className="mt-1.5 text-sm leading-5 text-slate-500">
							Consultez les principales données de protection de vos enfants.
						</p>
					</div>
				</div>
			</header>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<SummaryCard
					icon={<Search size={22} aria-hidden="true" />}
					value={reports.summary.searches}
					title="Recherches"
					description="Activité enregistrée"
					iconClassName="bg-blue-100 text-blue-600"
					progressClassName="bg-gradient-to-r from-blue-500 to-cyan-400"
					progressWidth="w-4/5"
				/>

				<SummaryCard
					icon={<ShieldAlert size={22} aria-hidden="true" />}
					value={reports.summary.blockedSites}
					title="Sites bloqués"
					description="Contenus filtrés"
					iconClassName="bg-pink-100 text-pink-600"
					progressClassName="bg-gradient-to-r from-pink-500 to-rose-400"
					progressWidth="w-3/5"
				/>

				<SummaryCard
					icon={<Bell size={22} aria-hidden="true" />}
					value={reports.summary.alerts}
					title="Alertes"
					description="Événements détectés"
					iconClassName="bg-orange-100 text-orange-600"
					progressClassName="bg-gradient-to-r from-orange-500 to-amber-400"
					progressWidth="w-2/3"
				/>

				<SummaryCard
					icon={<Clock3 size={22} aria-hidden="true" />}
					value={`${reports.summary.screenTimeUsed} min`}
					title="Temps utilisé"
					description="Aujourd’hui"
					iconClassName="bg-emerald-100 text-emerald-600"
					progressClassName="bg-gradient-to-r from-emerald-500 to-green-400"
					progressWidth="w-3/4"
				/>
			</section>

			<section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
				<article className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(30,41,59,0.08)] backdrop-blur-xl">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
								Suivi global
							</p>

							<h2 className="mt-1 text-2xl font-black text-slate-950">
								Temps d’écran global
							</h2>

							<p className="mt-1.5 text-sm text-slate-500">
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
							className={`h-full rounded-full bg-gradient-to-r ${totalProgressColor} transition-all duration-500`}
							style={{
								width: `${totalProgress}%`,
							}}
						/>
					</div>

					<div className="mt-4 flex flex-wrap items-center justify-between gap-3">
						<p className="text-sm font-semibold text-slate-600">
							{globalStatus}
						</p>

						<span className="rounded-full bg-violet-100 px-4 py-2 text-xs font-black text-violet-700">
							Suivi en temps réel
						</span>
					</div>
				</article>

				<article className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(30,41,59,0.08)] backdrop-blur-xl">
					<div>
						<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
							Bilan général
						</p>

						<h2 className="mt-1 text-2xl font-black text-slate-950">
							Résumé de l’activité
						</h2>

						<p className="mt-1.5 text-sm text-slate-500">
							Les principales données de protection sont à jour.
						</p>
					</div>

					<ul className="mt-5 grid gap-3 sm:grid-cols-2">
						<SummaryItem
							text={`${reports.summary.searches} recherches enregistrées`}
						/>

						<SummaryItem
							text={`${reports.summary.blockedSites} sites bloqués`}
						/>

						<SummaryItem
							text={`${reports.summary.alerts} alertes détectées`}
						/>

						<SummaryItem text={globalStatus} />
					</ul>
				</article>
			</section>

			<section className="space-y-4">
				<header>
					<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
						Profils suivis
					</p>

					<h2 className="mt-1 text-2xl font-black text-slate-950">
						Rapports par enfant
					</h2>

					<p className="mt-1.5 text-sm text-slate-500">
						Consultez les données principales de chaque profil.
					</p>
				</header>

				{reports.children.length === 0 ? (
					<section className="rounded-[28px] border border-dashed border-violet-200 bg-white/85 px-6 py-12 text-center shadow-[0_16px_42px_rgba(30,41,59,0.08)]">
						<BarChart3
							size={38}
							aria-hidden="true"
							className="mx-auto text-violet-300"
						/>

						<h3 className="mt-4 text-xl font-black text-slate-900">
							Aucun rapport disponible
						</h3>

						<p className="mt-2 text-sm text-slate-500">
							Les données des enfants apparaîtront ici.
						</p>
					</section>
				) : (
					<div className="grid gap-5 xl:grid-cols-2">
						{reports.children.map((child) => {
							const progress = getProgress(
								child.screen_time_used,
								child.screen_time_limit,
							);

							const progressColor = getProgressColor(progress);

							return (
								<article
									key={child.child_id}
									className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_42px_rgba(30,41,59,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(91,33,182,0.13)]"
								>
									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<div className="flex items-center gap-4">
											<div className="relative shrink-0">
												<Image
													src={getAvatarPath(child.avatar_url)}
													alt={`Avatar de ${child.first_name}`}
													width={84}
													height={84}
													className="h-20 w-20 rounded-full border-4 border-violet-100 object-cover shadow-md"
												/>

												<span className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-4 border-white bg-emerald-400" />
											</div>

											<div>
												<h3 className="text-2xl font-black text-slate-950">
													{child.first_name}
												</h3>

												<div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
													<ShieldCheck size={14} aria-hidden="true" />
													Protection active
												</div>

												<p className="mt-2 text-sm text-slate-500">
													Rapport individuel
												</p>
											</div>
										</div>

										<span className="w-fit rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-700">
											Profil protégé
										</span>
									</div>

									<div className="mt-6 grid gap-3 sm:grid-cols-3">
										<ChildStat
											icon={<Search size={17} aria-hidden="true" />}
											value={child.searches}
											label="Recherches"
											containerClassName="border-blue-100 bg-blue-50/70"
											iconClassName="text-blue-600"
											valueClassName="text-blue-700"
										/>

										<ChildStat
											icon={<ShieldAlert size={17} aria-hidden="true" />}
											value={child.blocked_sites}
											label="Bloqués"
											containerClassName="border-pink-100 bg-pink-50/70"
											iconClassName="text-pink-600"
											valueClassName="text-pink-700"
										/>

										<ChildStat
											icon={<Bell size={17} aria-hidden="true" />}
											value={child.alerts}
											label="Alertes"
											containerClassName="border-orange-100 bg-orange-50/70"
											iconClassName="text-orange-600"
											valueClassName="text-orange-700"
										/>
									</div>

									<section className="mt-5 rounded-[22px] border border-emerald-100 bg-emerald-50/60 p-4">
										<div className="flex items-center justify-between gap-4">
											<div className="flex items-center gap-3">
												<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
													<Clock3 size={19} aria-hidden="true" />
												</span>

												<div>
													<h4 className="font-black text-slate-900">
														Temps d’écran
													</h4>

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
												className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-500`}
												style={{
													width: `${progress}%`,
												}}
											/>
										</div>
									</section>
								</article>
							);
						})}
					</div>
				)}
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
}: {
	icon: React.ReactNode;
	value: number | string;
	title: string;
	description: string;
	iconClassName: string;
	progressClassName: string;
	progressWidth: string;
}) {
	return (
		<article className="rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(30,41,59,0.08)] backdrop-blur-xl">
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

function ChildStat({
	icon,
	value,
	label,
	containerClassName,
	iconClassName,
	valueClassName,
}: {
	icon: React.ReactNode;
	value: number;
	label: string;
	containerClassName: string;
	iconClassName: string;
	valueClassName: string;
}) {
	return (
		<div
			className={`rounded-2xl border p-4 text-center ${containerClassName}`}
		>
			<div
				className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ${iconClassName}`}
			>
				{icon}
			</div>

			<p className={`mt-3 text-2xl font-black ${valueClassName}`}>
				{value}
			</p>

			<p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
		</div>
	);
}

function SummaryItem({ text }: { text: string }) {
	return (
		<li className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm font-bold text-slate-700">
			<CheckCircle2
				size={17}
				aria-hidden="true"
				className="shrink-0 text-emerald-500"
			/>

			{text}
		</li>
	);
}