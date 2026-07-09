import { Clock, SearchCheck, Shield, Timer } from "lucide-react";

type QuickSettingsProps = {
  settings: {
    screen_time_limit: number;
    screen_time_used: number;
    filter_level: string;
    safe_search: number;
  };
};

export default function QuickSettings({ settings }: QuickSettingsProps) {
  const safeSearchLabel = settings.safe_search ? "Activée" : "Désactivée";

  return (
    <article className="rounded-3xl bg-white/95 p-6 shadow-xl">
      <h2 className="mb-5 text-2xl font-black">Paramètres rapides</h2>

      <section className="grid gap-4 sm:grid-cols-2">
        <SettingItem
          icon={<Shield size={24} />}
          title="Filtres de contenu"
          text={`Niveau : ${settings.filter_level}`}
        />

        <SettingItem
          icon={<Timer size={24} />}
          title="Limite de temps"
          text={`${settings.screen_time_limit} min par jour`}
        />

        <SettingItem
          icon={<SearchCheck size={24} />}
          title="Recherche sécurisée"
          text={safeSearchLabel}
        />

        <SettingItem
          icon={<Clock size={24} />}
          title="Temps utilisé"
          text={`${settings.screen_time_used} min`}
        />
      </section>
    </article>
  );
}

function SettingItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <section className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600">
        {icon}
      </span>

      <div>
        <h3 className="font-black">{title}</h3>
        <p className="text-sm text-slate-600">{text}</p>
      </div>
    </section>
  );
}