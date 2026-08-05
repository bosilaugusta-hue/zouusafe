import {
	AlertTriangle,
	CalendarDays,
	CheckCircle2,
	ShieldAlert,
	ShieldCheck,
	UsersRound,
} from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";

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

type ReasonStyle = {
	label: string;
	badgeClassName: string;
	iconClassName: string;
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
	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) {
		return {
			date: "Date indisponible",
			time: "",
		};
	}

	return {
		date: new Intl.DateTimeFormat("fr-FR", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}).format(parsedDate),

		time: new Intl.DateTimeFormat("fr-FR", {
			hour: "2-digit",
			minute: "2-digit",
		}).format(parsedDate),
	};
}

function getAvatarPath(avatarUrl: string | null) {
	if (!avatarUrl) {
		return "/avatars-profil/fille-15.png";
	}

	return avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`;
}

function getReasonStyle(reason: string): ReasonStyle {
	const normalizedReason = reason.toLowerCase();

	if (
		normalizedReason.includes("violence") ||
		normalizedReason.includes("dangereux")
	) {
		return {
			label: reason || "Contenu violent",
			badgeClassName: "bg-red-100 text-red-700",
			iconClassName: "bg-red-100 text-red-600",
		};
	}

	if (
		normalizedReason.includes("adulte") ||
		normalizedReason.includes("inapproprié")
	) {
		return {
			label: reason || "Contenu adulte",
			badgeClassName: "bg-orange-100 text-orange-700",
			iconClassName: "bg-orange-100 text-orange-600",
		};
	}

	if (
		normalizedReason.includes("social") ||
		normalizedReason.includes("réseau")
	) {
		return {
			label: reason || "Réseau social",
			badgeClassName: "bg-violet-100 text-violet-700",
			iconClassName: "bg-violet-100 text-violet-600",
		};
	}

	if (
		normalizedReason.includes("malware") ||
		normalizedReason.includes("virus")
	) {
		return {
			label: reason || "Malware / Virus",
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

	const protectedChildren = new Set(
		blockedSites.map((site) => site.child_id),
	).size;

	const importantAlerts = blockedSites.filter((site) => {
		const reason = site.reason.toLowerCase();

		return (
			reason.includes("violence") ||
			reason.includes("adulte") ||
			reason.includes("dangereux")
		);
	}).length;

	return (
		<main className="space-y-6">
			<header className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(91,33,182,0.1)] backdrop-blur-xl">
				<div className="flex items-center gap-4">
					<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 shadow-sm">
						<ShieldAlert size={27} aria-hidden="true" />
					</span>

					<div>
						<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
							Protection des contenus
						</p>

						<h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
							Sites bloqués
						</h1>

						<p className="mt-1.5 text-sm leading-5 text-slate-500">
							Consultez les contenus bloqués et les profils concernés.
						</p>
					</div>
				</div>
			</header>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<SummaryCard
					icon={<ShieldAlert size={22} aria-hidden="true" />}
					value={blockedSites.length}
					title="Contenus bloqués"
					description="Protection enregistrée"
					iconClassName="bg-pink-100 text-pink-600"
					progressClassName="bg-gradient-to-r from-pink-500 to-rose-400"
					progressWidth="w-3/5"
					trend="+15 %"
				/>

				<SummaryCard
					icon={<UsersRound size={22} aria-hidden="true" />}
					value={protectedChildren}
					title="Enfants concernés"
					description="Profils protégés"
					iconClassName="bg-violet-100 text-violet-600"
					progressClassName="bg-gradient-to-r from-violet-500 to-indigo-400"
					progressWidth="w-4/5"
					trend="0 %"
				/>

				<SummaryCard
					icon={<AlertTriangle size={22} aria-hidden="true" />}
					value={importantAlerts}
					title="Alertes importantes"
					description="Contenus sensibles"
					iconClassName="bg-orange-100 text-orange-600"
					progressClassName="bg-gradient-to-r from-orange-500 to-amber-400"
					progressWidth="w-2/3"
					trend="+25 %"
				/>

				<SummaryCard
					icon={<ShieldCheck size={22} aria-hidden="true" />}
					value="Actif"
					title="Filtrage"
					description="Protection en temps réel"
					iconClassName="bg-emerald-100 text-emerald-600"
					progressClassName="bg-gradient-to-r from-emerald-500 to-green-400"
					progressWidth="w-4/5"
					trend="Stable"
				/>
			</section>

			<section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_16px_45px_rgba(30,41,59,0.08)] backdrop-blur-xl">
				<header className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-xs font-black uppercase tracking-[0.18em] text-pink-500">
							Surveillance
						</p>

						<h2 className="mt-1 text-2xl font-black text-slate-950">
							Activité des blocages
						</h2>

						<p className="mt-1.5 text-sm text-slate-500">
							Les derniers contenus bloqués par ZouuSafe.
						</p>
					</div>

					<span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700">
						<span className="h-2 w-2 rounded-full bg-emerald-500" />
						Protection active
					</span>
				</header>

				{blockedSites.length === 0 ? (
					<section className="px-6 py-14 text-center">
						<span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
							<ShieldCheck size={26} aria-hidden="true" />
						</span>

						<h3 className="mt-4 text-xl font-black text-slate-900">
							Aucun contenu bloqué
						</h3>

						<p className="mt-2 text-sm text-slate-500">
							Aucune tentative de navigation inappropriée n’a été enregistrée.
						</p>
					</section>
				) : (
					<>
						<div className="hidden grid-cols-[1.3fr_0.8fr_1fr_0.9fr_0.6fr] gap-5 bg-violet-50/70 px-6 py-4 text-sm font-black text-slate-700 lg:grid">
							<span>Contenu bloqué</span>
							<span>Enfant concerné</span>
							<span>Raison du blocage</span>
							<span>Date et heure</span>
							<span>Statut</span>
						</div>

						<ul>
							{blockedSites.map((site) => {
								const reasonStyle = getReasonStyle(site.reason);
								const formattedDate = formatDate(site.blocked_at);

								return (
									<li
										key={site.blocked_content_id}
										className="grid gap-4 border-t border-slate-100 px-6 py-4 transition hover:bg-violet-50/30 lg:grid-cols-[1.3fr_0.8fr_1fr_0.9fr_0.6fr] lg:items-center lg:gap-5"
									>
										<div className="flex min-w-0 items-center gap-3">
											<span
												className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${reasonStyle.iconClassName}`}
											>
												<ShieldAlert size={20} aria-hidden="true" />
											</span>

											<div className="min-w-0">
												<p className="text-xs font-bold uppercase text-slate-400 lg:hidden">
													Contenu bloqué
												</p>

												<p className="truncate font-black text-slate-900">
													{site.content_name || "Contenu inconnu"}
												</p>

												<p className="mt-0.5 text-xs text-slate-500">
													Site web
												</p>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<Image
												src={getAvatarPath(site.avatar_url)}
												alt={`Avatar de ${site.first_name}`}
												width={36}
												height={36}
												className="h-9 w-9 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
											/>

											<div>
												<p className="text-xs font-bold uppercase text-slate-400 lg:hidden">
													Enfant
												</p>

												<p className="font-bold text-slate-700">
													{site.first_name}
												</p>
											</div>
										</div>

										<div>
											<p className="mb-1 text-xs font-bold uppercase text-slate-400 lg:hidden">
												Raison
											</p>

											<span
												className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${reasonStyle.badgeClassName}`}
											>
												{reasonStyle.label}
											</span>
										</div>

										<div className="flex items-center gap-2">
											<CalendarDays
												size={17}
												aria-hidden="true"
												className="shrink-0 text-slate-400"
											/>

											<div>
												<p className="text-xs font-bold uppercase text-slate-400 lg:hidden">
													Date
												</p>

												<time
													dateTime={site.blocked_at}
													className="text-sm font-bold text-slate-700"
												>
													{formattedDate.date}
												</time>

												<p className="mt-0.5 text-xs text-slate-500">
													{formattedDate.time}
												</p>
											</div>
										</div>

										<div>
											<p className="mb-1 text-xs font-bold uppercase text-slate-400 lg:hidden">
												Statut
											</p>

											<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
												<CheckCircle2 size={15} aria-hidden="true" />
												Bloqué
											</span>
										</div>
									</li>
								);
							})}
						</ul>
					</>
				)}
			</section>

			<section className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(30,41,59,0.08)] backdrop-blur-xl">
				<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex items-start gap-4">
						<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
							<ShieldCheck size={23} aria-hidden="true" />
						</span>

						<div>
							<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
								Bilan de sécurité
							</p>

							<h2 className="mt-1 text-xl font-black text-slate-950">
								Résumé de la protection
							</h2>

							<p className="mt-1.5 text-sm text-slate-500">
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
	trend,
}: {
	icon: React.ReactNode;
	value: number | string;
	title: string;
	description: string;
	iconClassName: string;
	progressClassName: string;
	progressWidth: string;
	trend: string;
}) {
	return (
		<article className="rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(30,41,59,0.08)] backdrop-blur-xl">
			<div className="flex items-start justify-between gap-3">
				<span
					className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClassName}`}
				>
					{icon}
				</span>

				<span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-700">
					{trend}
				</span>
			</div>

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
		</article>
	);
}

function SummaryItem({ text }: { text: string }) {
	return (
		<li className="flex items-center gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm font-bold text-slate-700">
			<CheckCircle2
				size={17}
				aria-hidden="true"
				className="shrink-0 text-emerald-500"
			/>

			{text}
		</li>
	);
}