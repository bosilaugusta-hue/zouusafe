import { Bell, LogOut, Settings } from "lucide-react";
import Image from "next/image";

type DashboardHeaderProps = {
	parentName: string;
	childName: string;
};

export default function DashboardHeader({
	parentName,
}: DashboardHeaderProps) {
	return (
		<header className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/90 p-7 shadow-xl backdrop-blur-xl">
			<div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-200/20 blur-3xl" />

			<div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-200/20 blur-3xl" />

			<section className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
				<section className="flex items-center gap-5">
					<Image
						src="/mascottes/Bonjour-robot.png"
						alt="Robot ZouuSafe qui salue le parent"
						width={130}
						height={160}
						priority
						className="float hidden h-auto w-[110px] shrink-0 drop-shadow-xl sm:block"
					/>

					<div>
						<p className="text-sm font-bold text-violet-600">
							Espace parent
						</p>

						<h1 className="mt-1 text-3xl font-black text-slate-900 md:text-4xl">
							Bonjour, {parentName} !
						</h1>

						<p className="mt-2 text-sm text-slate-600 md:text-base">
							Vos enfants sont protégés aujourd’hui.
						</p>
					</div>
				</section>

				<section className="flex flex-wrap items-center gap-3">
					<button
						type="button"
						aria-label="Voir les notifications"
						className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-md transition-all duration-300 hover:-translate-y-1 hover:text-violet-600 hover:shadow-lg"
					>
						<Bell size={20} />
					</button>

					<button
						type="button"
						className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-700 shadow-md transition-all duration-300 hover:-translate-y-1 hover:text-violet-600 hover:shadow-lg"
					>
						<Settings size={19} />
						Paramètres
					</button>

					<button
						type="button"
						className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-700 shadow-md transition-all duration-300 hover:-translate-y-1 hover:text-red-500 hover:shadow-lg"
					>
						<LogOut size={19} />
						Déconnexion
					</button>

					<section className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-md">
						<Image
							src="/avatars-profil/Maman-Bosila.png"
							alt={`Photo de ${parentName}`}
							width={46}
							height={46}
							className="h-11 w-11 rounded-full border-2 border-violet-200 object-cover"
						/>

						<div className="hidden sm:block">
							<p className="font-black text-slate-900">
								{parentName}
							</p>

							<p className="text-xs text-slate-500">
								Compte parent
							</p>
						</div>
					</section>
				</section>
			</section>
		</header>
	);
}