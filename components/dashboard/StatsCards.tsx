import { Clock, Search, Shield, UserRound } from "lucide-react";

type StatsCardsProps = {
	childrenCount: number;
	searchesCount: number;
	blockedCount: number;
	screenTime: number;
};

const statsConfig = [
	{
		key: "children",
		label: "Enfant suivi",
		description: "Profil protégé",
		status: "Protection active",
		icon: UserRound,
		color: "bg-violet-100 text-violet-600",
	},
	{
		key: "searches",
		label: "Recherches",
		description: "Aujourd’hui",
		status: "Activité récente",
		icon: Search,
		color: "bg-blue-100 text-blue-600",
	},
	{
		key: "blocked",
		label: "Sites bloqués",
		description: "Contenus filtrés",
		status: "Sécurité active",
		icon: Shield,
		color: "bg-pink-100 text-pink-600",
	},
	{
		key: "screenTime",
		label: "Temps d’écran",
		description: "Aujourd’hui",
		status: "Suivi en temps réel",
		icon: Clock,
		color: "bg-emerald-100 text-emerald-600",
	},
] as const;

export default function StatsCards({
	childrenCount,
	searchesCount,
	blockedCount,
	screenTime,
}: StatsCardsProps) {
	const values = {
		children: childrenCount,
		searches: searchesCount,
		blocked: blockedCount,
		screenTime: `${screenTime} min`,
	};

	return (
		<section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
			{statsConfig.map((stat) => {
				const Icon = stat.icon;

				return (
					<article
						key={stat.key}
						className="group rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
					>
						<div className="flex items-center gap-5">
							<span
								className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full shadow-md transition-transform duration-300 group-hover:scale-110 ${stat.color}`}
							>
								<Icon size={38} strokeWidth={2.4} />
							</span>

							<div className="min-w-0">
								<p className="text-4xl font-extrabold leading-none tracking-tight text-slate-900">
									{values[stat.key]}
								</p>

								<h2 className="mt-3 text-lg font-black text-slate-800">
									{stat.label}
								</h2>

								<p className="mt-1 text-sm text-slate-500">
									{stat.description}
								</p>
							</div>
						</div>

						<div className="mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-violet-400 to-pink-400" />

						<p className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-600">
							<span className="h-2 w-2 rounded-full bg-emerald-500" />
							{stat.status}
						</p>
					</article>
				);
			})}
		</section>
	);
}