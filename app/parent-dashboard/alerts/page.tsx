import {
	AlertCircle,
	AlertTriangle,
	ArrowLeft,
	Clock3,
	Info,
	ShieldCheck,
	UserRound,
} from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

type Alert = {
	alert_id: number;
	message: string;
	severity: string;
	created_at: string;
	child_name: string;
};

function getAlertStyle(severity: string) {
	if (severity === "high") {
		return {
			title: "Alerte importante",
			label: "Élevée",
			icon: AlertCircle,
			card: "border-red-200 bg-red-50",
			iconColor: "text-red-500",
			badge: "bg-red-100 text-red-700",
		};
	}

	if (severity === "medium") {
		return {
			title: "Attention",
			label: "Moyenne",
			icon: AlertTriangle,
			card: "border-orange-200 bg-orange-50",
			iconColor: "text-orange-500",
			badge: "bg-orange-100 text-orange-700",
		};
	}

	return {
		title: "Information",
		label: "Faible",
		icon: Info,
		card: "border-blue-200 bg-blue-50",
		iconColor: "text-blue-500",
		badge: "bg-blue-100 text-blue-700",
	};
}

function formatDate(value: string) {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "Date indisponible";
	}

	return new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

async function getAlerts(): Promise<Alert[]> {
	const cookieStore = await cookies();
	const session = cookieStore.get("zouusafe_session");

	if (!session) {
		throw new Error("Session introuvable.");
	}

	const response = await fetch("http://localhost:3000/api/alerts", {
		cache: "no-store",
		headers: {
			Cookie: `zouusafe_session=${session.value}`,
		},
	});

	if (!response.ok) {
		throw new Error("Impossible de récupérer les alertes.");
	}

	const data: { alerts: Alert[] } = await response.json();

	return data.alerts;
}

export default async function AlertsPage() {
	const alerts = await getAlerts();

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] px-5 py-8">
			<div className="mx-auto max-w-5xl">
				<Link
					href="/parent-dashboard"
					className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-violet-700 transition hover:text-violet-900"
				>
					<ArrowLeft size={18} />
					Retour au tableau de bord
				</Link>

				<section className="rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-[0_18px_45px_rgba(30,41,59,0.08)] backdrop-blur-xl">
					<header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
								Sécurité
							</p>

							<h1 className="mt-1 text-3xl font-black text-slate-950">
								Toutes les alertes
							</h1>

							<p className="mt-2 text-sm text-slate-500">
								Retrouvez les activités importantes détectées par ZouuSafe.
							</p>
						</div>

						<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
							<ShieldCheck size={27} aria-hidden="true" />
						</div>
					</header>

					{alerts.length === 0 ? (
						<div className="rounded-[24px] border border-dashed border-violet-200 bg-violet-50/60 px-6 py-12 text-center">
							<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
								<ShieldCheck size={25} aria-hidden="true" />
							</div>

							<h2 className="mt-4 text-lg font-black text-slate-900">
								Tout va bien
							</h2>

							<p className="mt-2 text-sm text-slate-500">
								Aucune alerte de sécurité n’a été détectée.
							</p>
						</div>
					) : (
						<ul className="space-y-3">
							{alerts.map((alert) => {
								const style = getAlertStyle(alert.severity);
								const Icon = style.icon;

								return (
									<li
										key={alert.alert_id}
										className={`rounded-[22px] border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${style.card}`}
									>
										<div className="flex items-start gap-4">
											<div
												className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${style.iconColor}`}
											>
												<Icon size={20} aria-hidden="true" />
											</div>

											<div className="min-w-0 flex-1">
												<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
													<h2 className="text-sm font-black text-slate-900">
														{style.title}
													</h2>

													<span
														className={`w-fit rounded-full px-3 py-1 text-[11px] font-black ${style.badge}`}
													>
														{style.label}
													</span>
												</div>

												<p className="mt-2 text-sm leading-6 text-slate-600">
													{alert.message}
												</p>

												<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
													<p className="flex items-center gap-1.5 text-xs font-bold text-violet-600">
														<UserRound size={13} aria-hidden="true" />
														{alert.child_name}
													</p>

													<p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
														<Clock3 size={13} aria-hidden="true" />
														{formatDate(alert.created_at)}
													</p>
												</div>
											</div>
										</div>
									</li>
								);
							})}
						</ul>
					)}
				</section>
			</div>
		</main>
	);
}