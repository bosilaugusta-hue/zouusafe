import { Clock, SearchCheck, Shield, Timer } from "lucide-react";

type SafetySettings = {
	screen_time_limit: number;
	screen_time_used: number;
	filter_level: string;
	safe_search: boolean;
};

type QuickSettingsProps = {
	settings: SafetySettings | null;
};

export default function QuickSettings({ settings }: QuickSettingsProps) {
	const safeSearchEnabled = settings?.safe_search ?? true;
	const filterLevel = settings?.filter_level ?? "Modéré";
	const screenTimeLimit = settings?.screen_time_limit ?? 120;
	const screenTimeUsed = settings?.screen_time_used ?? 0;

	const remainingTime = Math.max(screenTimeLimit - screenTimeUsed, 0);

	const progress = Math.min((screenTimeUsed / screenTimeLimit) * 100, 100) || 0;

	const progressColor =
		progress >= 100
			? "bg-red-500"
			: progress >= 75
				? "bg-orange-500"
				: "bg-emerald-500";

	return (
		<article className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-xl backdrop-blur-xl">
			<header className="mb-5 flex items-center justify-between">
				<div>
					<p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-500">
						Contrôle parental
					</p>

					<h2 className="mt-1 text-xl font-black text-slate-900">
						Paramètres rapides
					</h2>
				</div>

				<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-600 shadow-sm">
					<Shield size={20} />
				</div>
			</header>

			<section className="grid gap-4 sm:grid-cols-2">
				<SettingItem
					icon={<Shield size={22} />}
					title="Filtrage"
					text={filterLevel}
				/>

				<SettingItem
					icon={<SearchCheck size={22} />}
					title="Safe Search"
					text={safeSearchEnabled ? "Activé" : "Désactivé"}
				/>

				<SettingItem
					icon={<Timer size={22} />}
					title="Limite"
					text={`${screenTimeLimit} min / jour`}
				/>

			<section className="flex items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
	<div className="text-center">
		<p className="text-xs font-semibold text-emerald-600">
			Protection
		</p>

		<p className="mt-1 text-base font-black text-emerald-700">
			Active
		</p>
	</div>
</section>

				<section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:col-span-2">
					<div className="flex items-center gap-4">
						<span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600">
							<Clock size={24} />
						</span>

						<div className="flex-1">
							<h3 className="font-black text-slate-900">Temps d&apos;écran</h3>

							<p className="text-sm text-slate-500">
								{screenTimeUsed} / {screenTimeLimit} min
							</p>
						</div>

						<div className="text-right">
							<p className="text-2xl font-black text-violet-700">
								{remainingTime}
							</p>

							<p className="text-xs text-slate-500">min restantes</p>
						</div>
					</div>

					<div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
						<div
							className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
							style={{
								width: `${progress}%`,
							}}
						/>
					</div>

					<div className="mt-3 flex items-center justify-between">
						<p className="text-sm font-semibold text-slate-600">
							{Math.round(progress)}% utilisé
						</p>

						<span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
							Suivi en temps réel
						</span>
					</div>
				</section>
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
		<section className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-100 hover:shadow-md">
			<span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600">
				{icon}
			</span>

			<div>
				<h3 className="font-black text-slate-900">{title}</h3>

				<p className="text-sm text-slate-600">{text}</p>
			</div>
		</section>
	);
}