import {
	AlertCircle,
	AlertTriangle,
	Clock3,
	Info,
} from "lucide-react";
import Link from "next/link";

type Alert = {
	alert_id: number;
	message: string;
	severity: string;
	created_at: string;
};

type AlertsCardProps = {
	alerts: Alert[];
};

type AlertConfig = {
	title: string;
	label: string;
	icon: typeof AlertCircle;
	color: string;
	background: string;
	border: string;
	badge: string;
};

function getAlertConfig(severity: string): AlertConfig {
	switch (severity.toLowerCase()) {
		case "high":
			return {
				title: "Alerte importante",
				label: "Élevée",
				icon: AlertCircle,
				color: "text-red-500",
				background: "bg-red-50",
				border: "border-red-200",
				badge: "bg-red-100 text-red-700",
			};

		case "medium":
			return {
				title: "Attention",
				label: "Moyenne",
				icon: AlertTriangle,
				color: "text-orange-500",
				background: "bg-orange-50",
				border: "border-orange-200",
				badge: "bg-orange-100 text-orange-700",
			};

		default:
			return {
				title: "Information",
				label: "Faible",
				icon: Info,
				color: "text-blue-500",
				background: "bg-blue-50",
				border: "border-blue-200",
				badge: "bg-blue-100 text-blue-700",
			};
	}
}

function formatAlertDate(createdAt: string) {
	const date = new Date(createdAt);

	if (Number.isNaN(date.getTime())) {
		return "Date indisponible";
	}

	return new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

export default function AlertsCard({ alerts }: AlertsCardProps) {
	return (
		<article className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_16px_42px_rgba(30,41,59,0.08)] backdrop-blur-xl">
			<header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
						Sécurité
					</p>

					<h2 className="mt-1 text-xl font-black text-slate-900">
						Alertes récentes
					</h2>

					<p className="mt-1.5 text-sm leading-5 text-slate-500">
						Les dernières activités importantes détectées.
					</p>
				</div>

				<Link
					href="/parent-dashboard/alerts"
					className="inline-flex items-center justify-center rounded-2xl bg-violet-50 px-4 py-2 text-sm font-black text-violet-700 transition hover:bg-violet-100"
				>
					Voir toutes
					<span aria-hidden="true" className="ml-1">
						→
					</span>
				</Link>
			</header>

			{alerts.length === 0 ? (
				<div className="rounded-[24px] border border-dashed border-violet-200 bg-violet-50/50 px-5 py-8 text-center">
					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
						<AlertCircle size={23} aria-hidden="true" />
					</div>

					<h3 className="mt-3 text-lg font-black text-slate-900">
						Aucune alerte récente
					</h3>

					<p className="mt-1.5 text-sm leading-5 text-slate-500">
						Aucune activité importante n’a été détectée.
					</p>
				</div>
			) : (
				<ul className="space-y-3">
					{alerts.map((alert) => {
						const config = getAlertConfig(alert.severity);
						const Icon = config.icon;
						const formattedDate = formatAlertDate(alert.created_at);

						return (
							<li
								key={alert.alert_id}
								className={`rounded-[20px] border p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${config.background} ${config.border}`}
							>
								<div className="flex items-start gap-3">
									<div
										className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${config.color}`}
									>
										<Icon size={19} aria-hidden="true" />
									</div>

									<div className="min-w-0 flex-1">
										<div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
											<h3 className="text-sm font-black text-slate-900">
												{config.title}
											</h3>

											<span
												className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-black ${config.badge}`}
											>
												{config.label}
											</span>
										</div>

										<p className="mt-1.5 text-sm leading-5 text-slate-600">
											{alert.message}
										</p>

										<p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
											<Clock3 size={13} aria-hidden="true" />
											{formattedDate}
										</p>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</article>
	);
}