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
    description: "Zoé est protégée",
    icon: UserRound,
    color: "bg-violet-100 text-violet-600",
  },
  {
    key: "searches",
    label: "Recherches",
    description: "Aujourd'hui",
    icon: Search,
    color: "bg-blue-100 text-blue-600",
  },
  {
    key: "blocked",
    label: "Sites bloqués",
    description: "Contenus filtrés",
    icon: Shield,
    color: "bg-pink-100 text-pink-600",
  },
  {
    key: "screenTime",
    label: "Temps d'écran",
    description: "Aujourd'hui",
    icon: Clock,
    color: "bg-green-100 text-green-600",
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
            className="rounded-3xl border border-white/70 bg-white/95 p-6 shadow-xl"
          >
            <div className="flex items-center gap-5">
              <span
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${stat.color}`}
              >
                <Icon size={38} strokeWidth={2.4} />
              </span>

              <div>
                <p className="text-4xl font-black leading-none">
                  {values[stat.key]}
                </p>

                <h2 className="mt-2 font-black text-slate-800">
                  {stat.label}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {stat.description}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}