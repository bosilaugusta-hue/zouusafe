import Image from "next/image";
import { Bell, LogOut, Settings } from "lucide-react";

type DashboardHeaderProps = {
  parentName: string;
  childName: string;
};

export default function DashboardHeader({
  parentName,
  childName,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/90 p-6 shadow-lg">
      <div>
        <p className="text-sm font-semibold text-slate-500">
          Espace parent
        </p>

        <h1 className="mt-1 text-5xl font-black text-slate-900">
          Bonjour, {parentName} ! 👋
        </h1>

        <p className="mt-2 text-slate-600">
          {childName} navigue en sécurité aujourd'hui.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full bg-white p-4 shadow-md transition hover:scale-105"
        >
          <Bell size={20} />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-white px-5 py-4 font-bold shadow-md transition hover:scale-105"
        >
          <Settings size={18} />
          Paramètres
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-white px-5 py-4 font-bold shadow-md transition hover:scale-105"
        >
          <LogOut size={18} />
          Déconnexion
        </button>

        <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-md">
          <Image
  src="/Bosila.png"
  alt="Bosila"
  width={48}
  height={48}
  className="rounded-full"
/>
          <div>
            <p className="font-bold text-slate-900">
              {parentName}
            </p>

            <p className="text-xs text-slate-500">
              Compte parent
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}