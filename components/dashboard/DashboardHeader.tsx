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
		<header className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/90 px-6 py-5 shadow-[0_16px_45px_rgba(91,33,182,0.1)] backdrop-blur-xl">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-violet-200/25 blur-3xl"
			/>

			<div
				aria-hidden="true"
				className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-blue-200/20 blur-3xl"
			/>

			<div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex items-center gap-5">
					<Image
						src="/mascottes/Bonjour-robot.png"
						alt="Robot ZouuSafe qui salue le parent"
						width={120}
						height={120}
						priority
						className="hidden h-auto w-[105px] shrink-0 drop-shadow-lg sm:block"
					/>

					<div>
						<h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
							Bonjour, {parentName} !
						</h1>

						<p className="mt-2 text-sm font-medium text-slate-500 md:text-base">
							Voici un aperçu de l’activité de {childName} aujourd’hui.
						</p>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2.5">
					<div className="hidden items-center gap-2 rounded-2xl bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-700 xl:flex">
						<Heart
							size={17}
							fill="currentColor"
							aria-hidden="true"
						/>

						Toujours là pour vous
					</div>

					<button
						type="button"
						aria-label="Voir les notifications"
						className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-violet-600 hover:shadow-md"
					>
						<Bell size={19} aria-hidden="true" />
					</button>

					<Link
						href="/parent-dashboard/settings"
						aria-label="Ouvrir les paramètres"
						className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-violet-600 hover:shadow-md"
					>
						<Settings size={19} aria-hidden="true" />
					</Link>

					<button
						type="button"
						aria-label="Se déconnecter"
						className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md"
					>
						<LogOut size={19} aria-hidden="true" />
					</button>
				</div>
			</div>
		</header>
	);
}