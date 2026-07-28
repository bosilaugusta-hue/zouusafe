import {
	AlertTriangle,
	CalendarDays,
	CheckCircle2,
	ShieldAlert,
	ShieldCheck,
	UserRound,
	UsersRound,
} from "lucide-react";
import { cookies } from "next/headers";

type BlockedSite = {
	blocked_content_id: number;
	content_name: string;
	reason: string;
	blocked_at: string;
	child_id: number;
	first_name: string;
	avatar_url: string | null;
};

type BlockedResponse = {
	blockedSites: BlockedSite[];
};

async function getBlockedSites(): Promise<BlockedSite[]> {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("zouusafe_session");

	if (!sessionCookie) {
		throw new Error("Session utilisateur introuvable.");
	}

	const response = await fetch("http://localhost:3000/api/blocked", {
		cache: "no-store",
		headers: {
			Cookie: `zouusafe_session=${sessionCookie.value}`,
		},
	});

	if (!response.ok) {
		throw new Error("Impossible de récupérer les sites bloqués.");
	}

	const data = (await response.json()) as BlockedResponse;

	return data.blockedSites;
}

function formatDate(date: string) {
	return new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}

function getReasonStyle(reason: string) {
	const normalizedReason = reason.toLowerCase();

	if (
		normalizedReason.includes("violence") ||
		normalizedReason.includes("dangereux")
	) {
		return {
			label: reason,
			badgeClassName: "bg-red-100 text-red-700",
			iconClassName: "bg-red-100 text-red-600",
		};
	}

	if (
		normalizedReason.includes("adulte") ||
		normalizedReason.includes("inapproprié")
	) {
		return {
			label: reason,
			badgeClassName: "bg-orange-100 text-orange-700",
			iconClassName: "bg-orange-100 text-orange-600",
		};
	}

	if (
		normalizedReason.includes("social") ||
		normalizedReason.includes("réseau")
	) {
		return {
			label: reason,
			badgeClassName: "bg-violet-100 text-violet-700",
			iconClassName: "bg-violet-100 text-violet-600",
		};
	}

	if (
		normalizedReason.includes("malware") ||
		normalizedReason.includes("virus")
	) {
		return {
			label: reason,
			badgeClassName: "bg-emerald-100 text-emerald-700",
			iconClassName: "bg-emerald-100 text-emerald-600",
		};
	}

	return {
		label: reason || "Contenu non autorisé",
		badgeClassName: "bg-blue-100 text-blue-700",
		iconClassName: "bg-blue-100 text-blue-600",
	};
}

export default async function BlockedSitesPage() {
	const blockedSites = await getBlockedSites();

	const protectedChildren = new Set(blockedSites.map((site) => site.child_id))
		.size;

	const importantAlerts = blockedSites.filter((site) => {
		const reason = site.reason.toLowerCase();

		return (
			reason.includes("violence") ||
			reason.includes("adulte") ||
			reason.includes("dangereux")
		);
	}).length;

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-6 text-slate-900">
			<section className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
				<section className="space-y-6">
					<header className="rounded-[30px] border border-white/70 bg-white/90 p-7 shadow-xl backdrop-blur-xl">
						<div className="flex items-center gap-4">
							<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600 shadow-sm">
								<ShieldAlert size={28} aria-hidden="true" />
							</span>

							<div>
								<p className="text-sm font-black uppercase tracking-[0.15em] text-violet-500">
									Protection des contenus
								</p>

								<h1 className="mt-1 text-3xl font-black">Sites bloqués</h1>

								<p className="mt-2 text-sm text-slate-500">
									Consultez les contenus bloqués et les profils concernés.
								</p>
							</div>
						</div>
					</header>

					<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						<SummaryCard
							icon={<ShieldAlert size={24} aria-hidden="true" />}
							value={blockedSites.length}
							title="Contenus bloqués"
							description="Protection enregistrée"
							iconClassName="bg-pink-100 text-pink-600"
							lineClassName="from-pink-400 to-rose-400"
						/>

						<SummaryCard
							icon={<UsersRound size={24} aria-hidden="true" />}
							value={protectedChildren}
							title="Enfants concernés"
							description="Profils protégés"
							iconClassName="bg-violet-100 text-violet-600"
							lineClassName="from-violet-400 to-indigo-400"
						/>

						<SummaryCard
							icon={<AlertTriangle size={24} aria-hidden="true" />}
							value={importantAlerts}
							title="Alertes importantes"
							description="Contenus sensibles"
							iconClassName="bg-orange-100 text-orange-600"
							lineClassName="from-orange-400 to-yellow-400"
						/>

						<SummaryCard
							icon={<ShieldCheck size={24} aria-hidden="true" />}
							value="Actif"
							title="Filtrage"
							description="Protection en temps réel"
							iconClassName="bg-emerald-100 text-emerald-600"
							lineClassName="from-emerald-400 to-green-400"
						/>
					</section>

					<section className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
						<header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
							<div>
								<p className="text-sm font-black uppercase tracking-[0.14em] text-pink-500">
									Surveillance
								</p>

								<h2 className="mt-1 text-2xl font-black">
									Activité des blocages
								</h2>

								<p className="mt-2 text-sm text-slate-500">
									Les derniers contenus bloqués par ZouuSafe.
								</p>
							</div>

							<span className="w-fit rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700">
								Protection active
							</span>
						</header>

						<div className="mt-6">
							{blockedSites.length === 0 ? (
								<section className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-12 text-center">
									<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
										<ShieldCheck size={27} aria-hidden="true" />
									</div>

									<h3 className="mt-4 text-xl font-black">
										Aucun contenu bloqué
									</h3>

									<p className="mt-2 text-sm text-slate-500">
										Aucune tentative de navigation inappropriée n’a été
										enregistrée.
									</p>
								</section>
							) : (
								<ul className="grid gap-4 xl:grid-cols-2">
									{blockedSites.map((site) => {
										const reasonStyle = getReasonStyle(site.reason);

										return (
											<li
												key={site.blocked_content_id}
												className="rounded-[26px] border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-100 hover:shadow-lg"
											>
												<div className="flex items-start justify-between gap-4">
													<div className="flex min-w-0 items-center gap-4">
														<span
															className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${reasonStyle.iconClassName}`}
														>
															<ShieldAlert size={22} aria-hidden="true" />
														</span>

														<div className="min-w-0">
															<p className="text-sm font-bold text-slate-500">
																Contenu bloqué
															</p>

															<h3 className="mt-1 truncate text-lg font-black text-slate-900">
																{site.content_name}
															</h3>
														</div>
													</div>

													<span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
														Blocage réussi
													</span>
												</div>

												<div className="mt-5 flex flex-wrap gap-2">
													<span
														className={`rounded-full px-3 py-1.5 text-xs font-black ${reasonStyle.badgeClassName}`}
													>
														{reasonStyle.label}
													</span>

													<span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
														Protection automatique
													</span>
												</div>

												<div className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
													<div className="flex items-center gap-3">
														<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-violet-600 shadow-sm">
															<UserRound size={17} aria-hidden="true" />
														</span>

														<div>
															<p className="text-xs font-bold text-slate-400">
																Enfant
															</p>

															<p className="font-black text-slate-800">
																{site.first_name}
															</p>
														</div>
													</div>

													<div className="flex items-center gap-3">
														<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-pink-600 shadow-sm">
															<CalendarDays size={17} aria-hidden="true" />
														</span>

														<div>
															<p className="text-xs font-bold text-slate-400">
																Date
															</p>

															<p className="text-sm font-black text-slate-800">
																{formatDate(site.blocked_at)}
															</p>
														</div>
													</div>
												</div>
											</li>
										);
									})}
								</ul>
							)}
						</div>
					</section>

					<article className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
						<div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
							<div className="flex items-start gap-4">
								<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-600 shadow-sm">
									<ShieldCheck size={27} aria-hidden="true" />
								</span>

								<div>
									<p className="text-sm font-black uppercase tracking-[0.14em] text-violet-500">
										Bilan de sécurité
									</p>

									<h2 className="mt-1 text-2xl font-black">
										Résumé de la protection
									</h2>

									<p className="mt-2 text-sm text-slate-500">
										La protection des profils est actuellement opérationnelle.
									</p>
								</div>
							</div>

							<ul className="grid gap-3 sm:grid-cols-2">
								<SummaryItem text="Filtrage des contenus actif" />
								<SummaryItem text="Navigation sécurisée" />
								<SummaryItem text="Tous les profils sont protégés" />
								<SummaryItem text="Données mises à jour" />
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

			<p className="mt-4 text-3xl font-black text-slate-900">{value}</p>

			<p className="mt-1 font-black text-slate-800">{title}</p>

			<p className="mt-1 text-xs font-semibold text-slate-500">{description}</p>

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
