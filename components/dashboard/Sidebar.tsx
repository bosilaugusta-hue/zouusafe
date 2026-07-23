"use client";

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
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
	{
		label: "Mes enfants",
		href: "/parent-dashboard/children",
		icon: UserRound,
	},
	{
		label: "Historique",
		href: "/parent-dashboard/history",
		icon: Search,
	},
	{
		label: "Sites bloqués",
		href: "/parent-dashboard/blocked",
		icon: Shield,
	},
	{
		label: "Temps d'écran",
		href: "/parent-dashboard/screen-time",
		icon: Clock,
	},
	{
		label: "Paramètres",
		href: "/parent-dashboard/settings",
		icon: Settings,
	},
	{
		label: "Rapports",
		href: "/parent-dashboard/reports",
		icon: BarChart3,
	},
	{
		label: "Aide & Support",
		href: "/parent-dashboard/support",
		icon: CircleHelp,
	},
];

export default function Sidebar() {
	const pathname = usePathname();

	const isDashboardActive = pathname === "/parent-dashboard";

	return (
		<aside className="sticky top-6 flex h-[calc(100vh-3rem)] w-[280px] flex-col rounded-3xl border border-violet-100/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
			<Image
				src="/logos/Renard-logo.png"
				alt="Logo ZouuSafe"
				width={230}
				height={95}
				className="mx-auto transition-transform duration-300 hover:scale-[1.03]"
				priority
			/>

			<nav className="mt-9 space-y-2 text-sm font-bold">
				<Link
					href="/parent-dashboard"
					className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
						isDashboardActive
							? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg"
							: "text-slate-700 hover:bg-violet-50 hover:text-violet-700"
					}`}
				>
					<Home
						size={20}
						className={`transition-transform duration-300 group-hover:scale-110 ${
							isDashboardActive
								? "text-white"
								: "text-slate-500 group-hover:text-violet-600"
						}`}
					/>

					<span>Tableau de bord</span>
				</Link>

				{menuItems.map((item) => {
					const Icon = item.icon;

					const isActive =
						pathname === item.href ||
						pathname.startsWith(`${item.href}/`);

					return (
						<Link
							key={item.label}
							href={item.href}
							className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
								isActive
									? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg"
									: "text-slate-700 hover:bg-violet-50 hover:text-violet-700"
							}`}
						>
							<Icon
								size={20}
								className={`transition-transform duration-300 group-hover:scale-110 ${
									isActive
										? "text-white"
										: "text-slate-500 group-hover:text-violet-600"
								}`}
							/>

							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>

			<section className="mt-auto rounded-3xl border border-violet-100 bg-gradient-to-br from-white via-violet-50/60 to-blue-50/60 p-4 text-center shadow-sm">
				<Image
					src="/mascottes/renard-shield.png"
					alt="Protection ZouuSafe"
					width={145}
					height={145}
					className="mx-auto transition-transform duration-300 hover:scale-[1.03]"
				/>

				<h3 className="mt-3 font-black text-slate-900">
					Votre famille est protégée
				</h3>

				<p className="mt-2 text-sm leading-6 text-slate-600">
					ZouuSafe filtre les contenus sensibles et sécurise les
					recherches de vos enfants.
				</p>

				<div className="mt-4 h-2 overflow-hidden rounded-full bg-violet-100">
					<div className="h-full w-full rounded-full bg-gradient-to-r from-violet-400 to-blue-400" />
				</div>

				<div className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
					<span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
					Protection active
				</div>
			</section>
		</aside>
	);
}