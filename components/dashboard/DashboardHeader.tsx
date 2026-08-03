import { Bell, Heart, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type DashboardHeaderProps = {
	parentName: string;
	childName: string;
};

export default function DashboardHeader({
	parentName,
	childName,
}: DashboardHeaderProps) {
	return (
		<header className="relative z-20 min-h-[120px] px-2 pt-3">
			<div className="flex items-start justify-between gap-6">
				<div className="pt-2">
					<h1 className="flex flex-wrap items-center gap-2 text-3xl font-black tracking-tight text-slate-950 lg:text-4xl">
						Bonjour {parentName}
						<span aria-hidden="true">👋</span>
					</h1>

					<p className="mt-2 text-sm font-medium text-slate-600">
						Voici un aperçu de la sécurité de {childName} aujourd’hui.
					</p>
				</div>

				<div className="hidden items-start gap-3 lg:flex">
					<div className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-black leading-4 text-slate-800 shadow-[0_10px_30px_rgba(30,41,59,0.08)]">
						<span>
							Toujours là
							<br />
							pour vous !
						</span>

						<Heart
							size={18}
							fill="currentColor"
							className="text-violet-600"
							aria-hidden="true"
						/>
					</div>

					<div className="relative h-[78px] w-[120px] shrink-0">
	<Image
		src="/mascottes/Bonjour-robot.png"
		alt="Robot ZouuSafe"
		width={145}
		height={145}
		priority
		className="absolute -top-[48px] left-1/2 z-30 h-auto w-[120px] -translate-x-1/2 drop-shadow-lg"
	/>
</div>

					<div className="mt-2 flex items-center gap-2">
						<button
							type="button"
							aria-label="Voir les notifications"
							className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-[0_8px_24px_rgba(30,41,59,0.10)] transition hover:-translate-y-0.5 hover:text-violet-600"
						>
							<Bell size={20} />

							<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
								3
							</span>
						</button>

						<Link
							href="/parent-dashboard/settings"
							aria-label="Paramètres"
							className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-[0_8px_24px_rgba(30,41,59,0.10)] transition hover:-translate-y-0.5 hover:text-violet-600"
						>
							<Settings size={20} />
						</Link>

						<button
							type="button"
							aria-label="Déconnexion"
							className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-500 shadow-[0_8px_24px_rgba(30,41,59,0.10)] transition hover:-translate-y-0.5 hover:bg-red-50"
						>
							<LogOut size={20} />
						</button>
					</div>
				</div>

				<div className="flex items-center gap-2 lg:hidden">
					<button
						type="button"
						aria-label="Voir les notifications"
						className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"
					>
						<Bell size={18} />

						<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
							3
						</span>
					</button>

					<Link
						href="/parent-dashboard/settings"
						aria-label="Paramètres"
						className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"
					>
						<Settings size={18} />
					</Link>

					<button
						type="button"
						aria-label="Déconnexion"
						className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-500 shadow-sm"
					>
						<LogOut size={18} />
					</button>
				</div>
			</div>
		</header>
	);
}