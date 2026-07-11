import { Bell, LogOut, Settings } from "lucide-react";
import Image from "next/image";

type DashboardHeaderProps = {
	parentName: string;
	childName: string;
};

export default function DashboardHeader({
	parentName,
	childName,
}: DashboardHeaderProps) {
	return (
		<header className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
			<section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
				<section className="flex items-center gap-5">
					<Image
						src="/Bonjour_robot.png"
						alt="Robot ZouuSafe qui salue le parent"
						width={110}
						height={135}
						priority
						className="float hidden h-auto w-[90px] shrink-0 drop-shadow-lg sm:block"
					/>

					<div>
						<p className="text-sm font-bold text-violet-600">Espace parent</p>

						<h1 className="mt-1 text-3xl font-black text-slate-900 md:text-4xl">
							Bonjour, {parentName} !
						</h1>

						<p className="mt-2 text-sm text-slate-600 md:text-base">
							{childName} navigue en sécurité aujourd’hui.
						</p>
					</div>
				</section>

				<section className="flex flex-wrap items-center gap-3">
					<button
						type="button"
						aria-label="Voir les notifications"
						className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-md transition hover:-translate-y-0.5 hover:text-violet-600"
					>
						<Bell size={20} />
					</button>

					<button
						type="button"
						className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-700 shadow-md transition hover:-translate-y-0.5 hover:text-violet-600"
					>
						<Settings size={19} />
						Paramètres
					</button>

					<button
						type="button"
						className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-700 shadow-md transition hover:-translate-y-0.5 hover:text-red-500"
					>
						<LogOut size={19} />
						Déconnexion
					</button>

					<section className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-md">
						<Image
							src="/Bosila.png"
							alt={`Photo de ${parentName}`}
							width={46}
							height={46}
							className="h-11 w-11 rounded-full object-cover"
						/>

						<div className="hidden sm:block">
							<p className="font-black text-slate-900">{parentName}</p>

							<p className="text-xs text-slate-500">Compte parent</p>
						</div>
					</section>
				</section>
			</section>
		</header>
	);
}
