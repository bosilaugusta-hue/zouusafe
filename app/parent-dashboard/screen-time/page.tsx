import {
	CheckCircle2,
	Clock3,
	Hourglass,
	Lightbulb,
	ShieldCheck,
	TimerReset,
	UsersRound,
} from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import type { ReactNode } from "react";

type ChildScreenTime = {
	child_id: number;
	first_name: string;
	avatar_url: string | null;
	screen_time_limit: number | null;
	screen_time_used: number | null;
	filter_level: string | null;
	safe_search: boolean | null;
};

type ScreenTimeResponse = {
	children: ChildScreenTime[];
};

type StatusStyle = {
	label: string;
	text: string;
	badge: string;
	bar: string;
	background: string;
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

async function getScreenTime(): Promise<ChildScreenTime[]> {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("zouusafe_session");

	if (!sessionCookie) {
		throw new Error("Session utilisateur introuvable.");
	}

	const response = await fetch("http://localhost:3000/api/screen-time", {
		cache: "no-store",
		headers: {
			Cookie: `zouusafe_session=${sessionCookie.value}`,
		},
	});

	if (!response.ok) {
		throw new Error("Impossible de récupérer le temps d’écran.");
	}

	const data = (await response.json()) as ScreenTimeResponse;

	return data.children;
}

function getStatus(progress: number): StatusStyle {
	if (progress >= 100) {
		return {
			label: "Limite atteinte",
			text: "text-red-600",
			badge: "bg-red-100 text-red-700",
			bar: "from-red-400 to-rose-500",
			background: "bg-red-50",
		};
	}

	if (progress >= 80) {
		return {
			label: "Attention",
			text: "text-orange-600",
			badge: "bg-orange-100 text-orange-700",
			bar: "from-orange-400 to-amber-500",
			background: "bg-orange-50",
		};
	}

	return {
		label: "Temps respecté",
		text: "text-emerald-600",
		badge: "bg-emerald-100 text-emerald-700",
		bar: "from-emerald-400 to-green-500",
		background: "bg-emerald-50",
	};
}

function getImagePath(path: string) {
	return path.startsWith("/") ? path : `/${path}`;
}

export default async function ScreenTimePage() {
	const children = await getScreenTime();

	const totalUsed = children.reduce(
		(total, child) => total + (child.screen_time_used ?? 0),
		0,
	);

	const totalLimit = children.reduce(
		(total, child) => total + (child.screen_time_limit ?? 120),
		0,
	);

	const totalRemaining = Math.max(totalLimit - totalUsed, 0);

	const totalProgress =
		totalLimit > 0
			? Math.min(100, Math.round((totalUsed / totalLimit) * 100))
			: 0;

	const allSafeSearchEnabled = children.every(
		(child) => child.safe_search ?? true,
	);

	return (
		<main className="space-y-6">
			<header className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(91,33,182,0.1)] backdrop-blur-xl">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-4">
						<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
							<Clock3 size={27} aria-hidden="true" />
						</span>

						<div>
							<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
								Suivi quotidien
							</p>

							<h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
								Temps d’écran
							</h1>

							<p className="mt-1.5 text-sm leading-5 text-slate-500">
								Suivez le temps utilisé et les limites de chaque enfant.
							</p>
						</div>
					</div>

					<span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700">
						<span className="h-2 w-2 rounded-full bg-emerald-500" />
						Surveillance active
					</span>
				</div>
			</header>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<SummaryCard
					icon={<Clock3 size={22} aria-hidden="true" />}
					value={`${totalUsed} min`}
					title="Temps utilisé"
					description="Temps cumulé aujourd’hui"
					iconClassName="bg-emerald-100 text-emerald-600"
					progressClassName="bg-gradient-to-r from-emerald-500 to-green-400"
					progressWidth="w-3/5"
				/>

				<SummaryCard
					icon={<Hourglass size={22} aria-hidden="true" />}
					value={`${totalRemaining} min`}
					title="Temps restant"
					description="Disponible aujourd’hui"
					iconClassName="bg-blue-100 text-blue-600"
					progressClassName="bg-gradient-to-r from-blue-500 to-cyan-400"
					progressWidth="w-4/5"
				/>

				<SummaryCard
					icon={<TimerReset size={22} aria-hidden="true" />}
					value={`${totalLimit} min`}
					title="Limite totale"
					description="Pour tous les profils"
					iconClassName="bg-violet-100 text-violet-600"
					progressClassName="bg-gradient-to-r from-violet-500 to-indigo-400"
					progressWidth="w-3/4"
				/>

				<SummaryCard
					icon={<UsersRound size={22} aria-hidden="true" />}
					value={children.length}
					title="Profils suivis"
					description="Enfants avec une limite"
					iconClassName="bg-pink-100 text-pink-600"
					progressClassName="bg-gradient-to-r from-pink-500 to-rose-400"
					progressWidth="w-2/3"
				/>
			</section>

			{children.length > 0 ? (
				<section className="grid gap-5 xl:grid-cols-2">
					{children.map((child) => {
						const limit = child.screen_time_limit ?? 120;
						const used = child.screen_time_used ?? 0;
						const remaining = Math.max(limit - used, 0);

						const progress =
							limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

						const status = getStatus(progress);
						const initial =
							child.first_name.trim().charAt(0).toUpperCase() || "E";

						return (
							<article
								key={child.child_id}
								className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_42px_rgba(30,41,59,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(91,33,182,0.13)]"
							>
								<div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
									<div className="flex items-center gap-4">
										{child.avatar_url ? (
											<Image
												src={getImagePath(child.avatar_url)}
												alt={`Avatar de ${child.first_name}`}
												width={96}
												height={96}
												className="h-24 w-24 rounded-full border-4 border-violet-100 object-cover shadow-lg"
											/>
										) : (
											<div
												role="img"
												aria-label={`Avatar de ${child.first_name}`}
												className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-violet-100 bg-gradient-to-br from-violet-500 to-blue-500 text-3xl font-black text-white shadow-lg"
											>
												{initial}
											</div>
										)}

										<div>
											<h2 className="text-2xl font-black text-slate-950">
												{child.first_name}
											</h2>

											<p className="mt-1 text-sm font-semibold capitalize text-slate-500">
												Filtre : {child.filter_level ?? "standard"}
											</p>

											<span
												className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-black ${
													child.safe_search
														? "bg-emerald-100 text-emerald-700"
														: "bg-red-100 text-red-700"
												}`}
											>
												Safe Search {child.safe_search ? "activé" : "désactivé"}
											</span>
										</div>
									</div>

									<div className="text-left sm:text-right">
										<strong className={`text-3xl font-black ${status.text}`}>
											{progress} %
										</strong>

										<p
											className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black ${status.badge}`}
										>
											{status.label}
										</p>
									</div>
								</div>

								<div className={`mt-6 rounded-[22px] p-5 ${status.background}`}>
									<div className="flex items-center justify-between gap-4">
										<div>
											<p className="font-black text-slate-900">
												Temps d’écran aujourd’hui
											</p>

											<p className="mt-1 text-sm text-slate-500">
												{used} min utilisées sur {limit} min
											</p>
										</div>

										<Clock3
											size={24}
											aria-hidden="true"
											className={status.text}
										/>
									</div>

									<div className="mt-5 h-4 overflow-hidden rounded-full bg-white shadow-inner">
										<div
											className={`h-full rounded-full bg-gradient-to-r ${status.bar} shadow-sm transition-all duration-500`}
											style={{
												width: `${progress}%`,
											}}
										/>
									</div>

									<p className="mt-4 text-sm font-black text-slate-700">
										{remaining > 0
											? `${remaining} minutes restantes`
											: "Aucun temps restant"}
									</p>
								</div>
							</article>
						);
					})}
				</section>
			) : (
				<section className="rounded-[28px] border border-dashed border-violet-200 bg-white/80 p-10 text-center shadow-lg backdrop-blur-xl">
					<span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-500">
						<Clock3 size={28} aria-hidden="true" />
					</span>

					<h2 className="mt-4 text-2xl font-black">Aucun profil à suivre</h2>

					<p className="mt-2 text-slate-500">
						Ajoutez un profil enfant pour suivre son temps d’écran.
					</p>
				</section>
			)}

			<section className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
				<article className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_42px_rgba(30,41,59,0.08)] backdrop-blur-xl">
					<div className="flex items-start gap-4">
						<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
							<ShieldCheck size={24} aria-hidden="true" />
						</span>

						<div>
							<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
								Bilan quotidien
							</p>

							<h2 className="mt-1 text-xl font-black text-slate-950">
								Résumé du temps d’écran
							</h2>

							<p className="mt-1.5 text-sm text-slate-500">
								{totalUsed} min utilisées sur {totalLimit} min autorisées.
							</p>
						</div>
					</div>

					<div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100 shadow-inner">
						<div
							className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600 transition-all duration-500"
							style={{
								width: `${totalProgress}%`,
							}}
						/>
					</div>

					<p className="mt-3 text-sm font-semibold text-slate-600">
						{totalProgress}% de la limite globale utilisée.
					</p>

					<ul className="mt-5 grid gap-3 sm:grid-cols-2">
						<SummaryItem text="Contrôle parental actif" />
						<SummaryItem text="Limites suivies" />
						<SummaryItem text="Safe Search vérifié" />
						<SummaryItem text="Données actualisées" />
					</ul>
				</article>

				<article className="rounded-[28px] border border-amber-100 bg-amber-50/80 p-6 shadow-[0_16px_42px_rgba(30,41,59,0.06)]">
					<div className="flex items-start gap-4">
						<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
							<Lightbulb size={23} aria-hidden="true" />
						</span>

						<div>
							<p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">
								Conseils ZouuSafe
							</p>

							<h2 className="mt-1 text-xl font-black text-slate-950">
								À retenir aujourd’hui
							</h2>
						</div>
					</div>

					<ul className="mt-5 space-y-3">
						<li className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700">
							{totalRemaining > 0
								? `${totalRemaining} minutes restent disponibles pour l’ensemble des profils.`
								: "La limite globale de temps d’écran est atteinte."}
						</li>

						<li className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700">
							{allSafeSearchEnabled
								? "Safe Search est activé sur tous les profils."
								: "Safe Search est désactivé sur au moins un profil."}
						</li>

						<li className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700">
							Les limites sont calculées à partir des réglages enregistrés pour
							chaque enfant.
						</li>
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