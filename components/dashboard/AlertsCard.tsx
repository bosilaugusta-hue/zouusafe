import {
	AlertCircle,
	AlertTriangle,
	Clock3,
	Info,
} from "lucide-react";

type Alert = {
	alert_id: number;
	message: string;
	severity: string;
	created_at: string;
};

type AlertsCardProps = {
	alerts: Alert[];
};

export default function AlertsCard({
	alerts,
}: AlertsCardProps) {
	const getConfig = (severity: string) => {
		switch (severity.toLowerCase()) {
			case "high":
				return {
					title: "Alerte importante",
					icon: AlertCircle,
					color: "text-red-500",
					bg: "bg-red-50",
					border: "border-red-200",
					badge: "bg-red-100 text-red-600",
				};

			case "medium":
				return {
					title: "Attention",
					icon: AlertTriangle,
					color: "text-orange-500",
					bg: "bg-orange-50",
					border: "border-orange-200",
					badge: "bg-orange-100 text-orange-600",
				};

			default:
				return {
					title: "Information",
					icon: Info,
					color: "text-blue-500",
					bg: "bg-blue-50",
					border: "border-blue-200",
					badge: "bg-blue-100 text-blue-600",
				};
		}
	};

	return (
		<article className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-black">
						Alertes récentes
					</h2>

					<p className="mt-1 text-sm text-slate-500">
						Les dernières activités importantes.
					</p>
				</div>

				<button
					type="button"
					className="rounded-xl bg-violet-50 px-4 py-2 text-sm font-bold text-violet-600 transition hover:bg-violet-100"
				>
					Voir toutes
				</button>
			</div>

			<ul className="space-y-4">
				{alerts.map((alert) => {
					const config = getConfig(alert.severity);

					const Icon = config.icon;

					return (
						<li
							key={alert.alert_id}
							className={`rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${config.bg} ${config.border}`}
						>
							<div className="flex items-start gap-4">
								<div
									className={`flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ${config.color}`}
								>
									<Icon size={22} />
								</div>

								<div className="flex-1">
									<div className="flex items-center justify-between gap-3">
										<h3 className="font-black text-slate-900">
											{config.title}
										</h3>

										<span
											className={`rounded-full px-3 py-1 text-xs font-bold ${config.badge}`}
										>
											{alert.severity.toUpperCase()}
										</span>
									</div>

									<p className="mt-2 text-sm leading-6 text-slate-600">
										{alert.message}
									</p>

									<div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
										<Clock3 size={14} />
										Récemment
									</div>
								</div>
							</div>
						</li>
					);
				})}
			</ul>
		</article>
	);
}