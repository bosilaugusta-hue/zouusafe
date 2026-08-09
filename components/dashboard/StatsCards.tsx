import {
	ArrowUpRight,
	Clock,
	Search,
	Shield,
	UserRound,
} from "lucide-react";

type StatsCardsProps = {
	childrenCount: number;
	searchesCount: number;
	blockedCount: number;
	screenTime: number;
};

const statsConfig = [
	{
		key: "children",
		label: "Enfants suivis",
		description: "Profils actuellement protégés",
		trend: "+1",
		progress: "w-4/5",
		icon: UserRound,
		iconStyle: "bg-violet-100 text-violet-600",
		progressStyle: "from-violet-500 to-fuchsia-400",
	},
	{
		key: "searches",
		label: "Recherches",
		description: "Recherches effectuées aujourd’hui",
		trend: "+12 %",
		progress: "w-3/4",
		icon: Search,
		iconStyle: "bg-blue-100 text-blue-600",
		progressStyle: "from-blue-500 to-cyan-400",
	},
	{
		key: "blocked",
		label: "Sites bloqués",
		description: "Contenus dangereux filtrés",
		trend: "+5 %",
		progress: "w-2/3",
		icon: Shield,
		iconStyle: "bg-pink-100 text-pink-600",
		progressStyle: "from-pink-500 to-rose-400",
	},
	{
		key: "screenTime",
		label: "Temps d’écran",
		description: "Temps utilisé aujourd’hui",
		trend: "Stable",
		progress: "w-3/5",
		icon: Clock,
		iconStyle: "bg-emerald-100 text-emerald-600",
		progressStyle: "from-emerald-500 to-teal-400",
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
		<section
			aria-label="Résumé de l’activité"
			className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
		>
			{statsConfig.map((stat) => {
				const Icon = stat.icon;

				return (
					<article
						key={stat.key}
						className="group relative min-h-[132px] overflow-hidden rounded-[24px] border border-white/70 bg-white/85 p-3.5 shadow-[0_12px_32px_rgba(30,41,59,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(91,33,182,0.14)] md:min-h-[150px] md:rounded-[28px] md:p-4"
					>
						<div
							aria-hidden="true"
							className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-violet-100/45 blur-3xl"
						/>

						<div className="relative flex h-full flex-col">
							<div className="flex items-start justify-between gap-3">
								<span
									className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] shadow-md ring-4 ring-white transition-all duration-300 group-hover:scale-105 md:h-14 md:w-14 md:rounded-[20px] ${stat.iconStyle}`}
								>
									<Icon
	size={23}
	strokeWidth={2.3}
	aria-hidden="true"
	className="md:h-[27px] md:w-[27px]"
/>
								</span>

								<span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-700">
									<ArrowUpRight
										size={12}
										aria-hidden="true"
									/>

									{stat.trend}
								</span>
							</div>

							<div className="mt-2 md:mt-3">
								<p className="text-[26px] font-black leading-none tracking-tight text-slate-900 md:text-3xl">
									{values[stat.key]}
								</p>

								<h2 className="mt-1.5 text-base font-black text-slate-800">
									{stat.label}
								</h2>

								<p className="mt-0.5 text-xs leading-4 text-slate-500">
									{stat.description}
								</p>
							</div>

							<div className="mt-auto pt-2 md:pt-3">
								<div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
									<div
										className={`h-full rounded-full bg-gradient-to-r ${stat.progress} ${stat.progressStyle}`}
									/>
								</div>
							</div>
						</div>
					</article>
				);
			})}
		</section>
	);
}