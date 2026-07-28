import { jwtVerify } from "jose";
import {
	ArrowLeft,
	BarChart3,
	Bell,
	Clock3,
	ExternalLink,
	Search,
	Settings,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import type { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";

type PageProps = {
	params: Promise<{
		id: string;
	}>;
};

type SessionPayload = {
	parentId: number;
};

type ChildRow = RowDataPacket & {
	child_id: number;
	first_name: string;
	birth_date: string;
	avatar_url: string | null;
	screen_time_limit: number | null;
	screen_time_used: number | null;
	filter_level: string | null;
	safe_search: boolean | null;
};

type SearchHistoryRow = RowDataPacket & {
	search_history_id: number;
	search_query: string;
	created_at: Date;
};

type AlertRow = RowDataPacket & {
	alert_id: number;
	message: string;
	severity: string;
	created_at: Date;
};

type CountRow = RowDataPacket & {
	total: number;
};

function getSecretKey() {
	const secret = process.env.AUTH_SECRET;

	if (!secret) {
		throw new Error("AUTH_SECRET est absent de .env.local.");
	}

	return new TextEncoder().encode(secret);
}

function calculateAge(birthDate: string) {
	const birth = new Date(birthDate);
	const today = new Date();

	let age = today.getFullYear() - birth.getFullYear();

	const monthDifference = today.getMonth() - birth.getMonth();

	if (
		monthDifference < 0 ||
		(monthDifference === 0 && today.getDate() < birth.getDate())
	) {
		age -= 1;
	}

	return age;
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("fr-FR", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(new Date(date));
}

export default async function ChildProfilePage({ params }: PageProps) {
	const { id } = await params;
	const childId = Number(id);

	if (!Number.isInteger(childId) || childId <= 0) {
		notFound();
	}

	const cookieStore = await cookies();
	const token = cookieStore.get("zouusafe_session")?.value;

	if (!token) {
		notFound();
	}

	const { payload } = await jwtVerify(token, getSecretKey());
	const { parentId } = payload as SessionPayload;

	const [children] = await db.query<ChildRow[]>(
		`
			SELECT
				child.child_id,
				child.first_name,
				child.birth_date,
				child.avatar_url,
				safety_setting.screen_time_limit,
				safety_setting.screen_time_used,
				safety_setting.filter_level,
				safety_setting.safe_search
			FROM child
			LEFT JOIN safety_setting
				ON safety_setting.child_id = child.child_id
			WHERE child.child_id = ?
				AND child.parent_id = ?
			LIMIT 1
		`,
		[childId, parentId],
	);

	const child = children[0];

	if (!child) {
		notFound();
	}

	const [history] = await db.query<SearchHistoryRow[]>(
		`
			SELECT
				search_history_id,
				search_query,
				created_at
			FROM search_history
			WHERE child_id = ?
			ORDER BY created_at DESC
			LIMIT 5
		`,
		[childId],
	);

	const [alerts] = await db.query<AlertRow[]>(
		`
			SELECT
				alert_id,
				message,
				severity,
				created_at
			FROM alert
			WHERE child_id = ?
			ORDER BY created_at DESC
			LIMIT 5
		`,
		[childId],
	);

	const [searchCountRows] = await db.query<CountRow[]>(
		`
			SELECT COUNT(*) AS total
			FROM search_history
			WHERE child_id = ?
		`,
		[childId],
	);

	const [blockedCountRows] = await db.query<CountRow[]>(
		`
			SELECT COUNT(*) AS total
			FROM blocked_content
			WHERE child_id = ?
		`,
		[childId],
	);

	const age = calculateAge(child.birth_date);

	const avatar = child.avatar_url ?? "/avatars-profil/fille-1.png";

	const avatarSrc = avatar.startsWith("/") ? avatar : `/${avatar}`;

	const screenTimeLimit = child.screen_time_limit ?? 120;
	const screenTimeUsed = child.screen_time_used ?? 0;

	const progress =
		screenTimeLimit > 0
			? Math.min(100, Math.round((screenTimeUsed / screenTimeLimit) * 100))
			: 0;

	const searchCount = searchCountRows[0]?.total ?? 0;
	const blockedCount = blockedCountRows[0]?.total ?? 0;

	const safeSearchEnabled = child.safe_search ?? true;
	const filterLevel = child.filter_level ?? "standard";

	const tools = [
		{
			title: "Historique",
			description: "Consulter toutes les recherches",
			icon: Search,
			href: `/parent-dashboard/history?childId=${child.child_id}`,
			background: "bg-blue-50",
			iconClass: "bg-blue-100 text-blue-600",
		},
		{
			title: "Sites bloqués",
			description: "Voir les contenus filtrés",
			icon: ShieldCheck,
			href: `/parent-dashboard/blocked-sites?childId=${child.child_id}`,
			background: "bg-pink-50",
			iconClass: "bg-pink-100 text-pink-600",
		},
		{
			title: "Temps d’écran",
			description: "Gérer la limite quotidienne",
			icon: Clock3,
			href: `/parent-dashboard/screen-time?childId=${child.child_id}`,
			background: "bg-green-50",
			iconClass: "bg-green-100 text-green-600",
		},
		{
			title: "Paramètres",
			description: "Modifier la protection",
			icon: Settings,
			href: `/parent-dashboard/settings?childId=${child.child_id}`,
			background: "bg-violet-50",
			iconClass: "bg-violet-100 text-violet-600",
		},
		{
			title: "Rapports",
			description: "Suivre l’activité de l’enfant",
			icon: BarChart3,
			href: `/parent-dashboard/reports?childId=${child.child_id}`,
			background: "bg-orange-50",
			iconClass: "bg-orange-100 text-orange-600",
		},
	];

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] px-5 py-8 text-slate-900 md:px-8">
			<section className="mx-auto w-full max-w-6xl">
				<Link
					href="/parent-dashboard"
					className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-violet-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
				>
					<ArrowLeft size={17} />
					Retour au tableau de bord
				</Link>

				<section className="mt-6 overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-xl backdrop-blur-xl">
					<header className="relative overflow-hidden bg-gradient-to-r from-violet-100 via-pink-50 to-blue-50 p-7 md:p-9">
						<div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-violet-300/20 blur-3xl" />
						<div className="absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-pink-300/20 blur-3xl" />

						<div className="relative flex flex-col items-center justify-between gap-7 md:flex-row">
							<div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
								<Image
									src={avatarSrc}
									alt={`Avatar de ${child.first_name}`}
									width={150}
									height={150}
									priority
									className="h-32 w-32 rounded-full border-8 border-white object-cover shadow-xl md:h-36 md:w-36"
								/>

								<div>
									<p className="inline-flex items-center gap-2 font-black text-violet-600">
										<Sparkles size={17} />
										Profil enfant
									</p>

									<h1 className="mt-2 text-4xl font-black md:text-5xl">
										{child.first_name}
									</h1>

									<p className="mt-2 text-lg font-semibold text-slate-600">
										{age} {age > 1 ? "ans" : "an"}
									</p>

									<span className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
										<span className="h-2.5 w-2.5 rounded-full bg-green-500" />
										Protection active
									</span>
								</div>
							</div>

							<Link
								href={`/child-dashboard?childId=${child.child_id}`}
								className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-700 px-6 py-4 text-center font-black text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl md:w-auto"
							>
								<Search size={21} />
								Ouvrir l’espace sécurisé
								<ExternalLink
									size={18}
									className="transition group-hover:translate-x-1"
								/>
							</Link>
						</div>
					</header>

					<div className="space-y-7 p-6 md:p-8">
						<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<article className="rounded-3xl border border-violet-100 bg-violet-50 p-5">
								<div className="flex items-center justify-between">
									<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
										<Clock3 size={22} />
									</span>

									<strong className="text-2xl font-black">
										{screenTimeUsed} min
									</strong>
								</div>

								<h2 className="mt-4 font-black">Temps utilisé</h2>

								<p className="mt-1 text-sm text-slate-500">
									sur {screenTimeLimit} min
								</p>
							</article>

							<article className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
								<div className="flex items-center justify-between">
									<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
										<Search size={22} />
									</span>

									<strong className="text-2xl font-black">{searchCount}</strong>
								</div>

								<h2 className="mt-4 font-black">Recherches</h2>

								<p className="mt-1 text-sm text-slate-500">enregistrées</p>
							</article>

							<article className="rounded-3xl border border-pink-100 bg-pink-50 p-5">
								<div className="flex items-center justify-between">
									<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
										<ShieldCheck size={22} />
									</span>

									<strong className="text-2xl font-black">
										{blockedCount}
									</strong>
								</div>

								<h2 className="mt-4 font-black">Sites bloqués</h2>

								<p className="mt-1 text-sm text-slate-500">contenus filtrés</p>
							</article>

							<article className="rounded-3xl border border-green-100 bg-green-50 p-5">
								<div className="flex items-center justify-between">
									<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-600">
										<ShieldCheck size={22} />
									</span>

									<strong className="text-lg font-black capitalize">
										{filterLevel}
									</strong>
								</div>

								<h2 className="mt-4 font-black">Niveau de filtre</h2>

								<p className="mt-1 text-sm text-slate-500">
									SafeSearch {safeSearchEnabled ? "activé" : "désactivé"}
								</p>
							</article>
						</section>

						<section className="rounded-3xl border border-violet-100 bg-violet-50/70 p-5 md:p-6">
							<div className="flex items-center justify-between gap-4">
								<div>
									<h2 className="text-xl font-black">
										Temps d’écran aujourd’hui
									</h2>

									<p className="mt-1 text-sm text-slate-600">
										{screenTimeUsed} minutes utilisées sur {screenTimeLimit}{" "}
										minutes autorisées
									</p>
								</div>

								<strong className="text-xl font-black text-violet-600">
									{progress} %
								</strong>
							</div>

							<div className="mt-5 h-4 overflow-hidden rounded-full bg-white shadow-inner">
								<div
									className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600 transition-all"
									style={{
										width: `${progress}%`,
									}}
								/>
							</div>
						</section>

						<section>
							<div>
								<p className="text-sm font-black uppercase tracking-wider text-violet-600">
									Accès rapides
								</p>

								<h2 className="mt-1 text-2xl font-black">
									Gérer le profil de {child.first_name}
								</h2>
							</div>

							<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
								{tools.map((tool) => {
									const Icon = tool.icon;

									return (
										<Link
											key={tool.title}
											href={tool.href}
											className={`group rounded-3xl border border-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${tool.background}`}
										>
											<span
												className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tool.iconClass}`}
											>
												<Icon size={23} />
											</span>

											<h3 className="mt-4 font-black">{tool.title}</h3>

											<p className="mt-1 text-sm leading-5 text-slate-600">
												{tool.description}
											</p>

											<span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-violet-600">
												Ouvrir
												<span className="transition group-hover:translate-x-1">
													→
												</span>
											</span>
										</Link>
									);
								})}
							</div>
						</section>

						<section className="grid gap-6 lg:grid-cols-2">
							<article className="min-h-72 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
								<div className="flex items-center justify-between gap-4">
									<div className="flex items-center gap-3">
										<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
											<Search size={21} />
										</span>

										<h2 className="text-xl font-black">Historique récent</h2>
									</div>

									<Link
										href={`/parent-dashboard/history?childId=${child.child_id}`}
										className="text-sm font-black text-violet-600 hover:underline"
									>
										Voir tout
									</Link>
								</div>

								{history.length === 0 ? (
									<div className="flex min-h-48 flex-col items-center justify-center text-center">
										<Search size={38} className="text-slate-300" />

										<p className="mt-4 font-bold text-slate-500">
											Aucune recherche enregistrée.
										</p>
									</div>
								) : (
									<ul className="mt-5 space-y-3">
										{history.map((item) => (
											<li
												key={item.search_history_id}
												className="rounded-2xl bg-blue-50 px-4 py-3"
											>
												<p className="font-black">{item.search_query}</p>

												<p className="mt-1 text-xs text-slate-500">
													{formatDate(item.created_at)}
												</p>
											</li>
										))}
									</ul>
								)}
							</article>

							<article className="min-h-72 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
								<div className="flex items-center justify-between gap-4">
									<div className="flex items-center gap-3">
										<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
											<Bell size={21} />
										</span>

										<h2 className="text-xl font-black">Alertes récentes</h2>
									</div>

									<Link
										href="/parent-dashboard"
										className="text-sm font-black text-violet-600 hover:underline"
									>
										Voir tout
									</Link>
								</div>

								{alerts.length === 0 ? (
									<div className="flex min-h-48 flex-col items-center justify-center text-center">
										<Bell size={38} className="text-slate-300" />

										<p className="mt-4 font-bold text-slate-500">
											Aucune alerte pour le moment.
										</p>
									</div>
								) : (
									<ul className="mt-5 space-y-3">
										{alerts.map((alert) => {
											const severityClass =
												alert.severity === "high"
													? "bg-red-50 text-red-700"
													: alert.severity === "medium"
														? "bg-orange-50 text-orange-700"
														: "bg-blue-50 text-blue-700";

											return (
												<li
													key={alert.alert_id}
													className={`rounded-2xl px-4 py-3 ${severityClass}`}
												>
													<p className="font-black">{alert.message}</p>

													<p className="mt-1 text-xs opacity-70">
														{formatDate(alert.created_at)}
													</p>
												</li>
											);
										})}
									</ul>
								)}
							</article>
						</section>
					</div>
				</section>
			</section>
		</main>
	);
}
