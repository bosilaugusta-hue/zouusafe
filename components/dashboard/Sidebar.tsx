import Image from "next/image";
import {
  BarChart3,
  CircleHelp,
  Clock,
  Home,
  Search,
  Settings,
  Shield,
  UserRound,
} from "lucide-react";

const menuItems = [
  { label: "Mes enfants", icon: UserRound },
  { label: "Historique", icon: Search },
  { label: "Sites bloqués", icon: Shield },
  { label: "Temps d'écran", icon: Clock },
  { label: "Paramètres", icon: Settings },
  { label: "Rapports", icon: BarChart3 },
  { label: "Aide & Support", icon: CircleHelp },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-6 flex h-[calc(100vh-3rem)] w-[280px] flex-col rounded-3xl bg-white/95 p-6 shadow-2xl">
      <Image
        src="/renard.png"
        alt="Logo ZouuSafe"
        width={230}
        height={95}
        className="mx-auto"
        priority
      />

      <nav className="mt-10 space-y-3 text-sm font-black">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 text-left text-white shadow-lg"
        >
          <Home size={20} />
          Tableau de bord
        </button>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-800 transition hover:bg-violet-50"
            >
              <Icon size={20} className="text-slate-500" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <section className="mt-auto rounded-3xl border border-violet-100 bg-white p-4 text-center shadow-sm">
        <Image
          src="/renard-shield.png"
          alt="Protection ZouuSafe"
          width={150}
          height={150}
          className="mx-auto"
        />

        <p className="mt-3 font-black">ZouuSafe protège vos enfants en ligne</p>

        <p className="mt-2 text-sm text-slate-600">
          Toutes les recherches sont filtrées et sécurisées.
        </p>

        <p className="mt-4 rounded-full bg-green-100 px-3 py-2 text-sm font-black text-green-700">
          Protection active
        </p>
      </section>
    </aside>
  );
}