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
		<aside className="sticky top-6 flex h-[calc(100vh-3rem)] w-[280px] flex-col rounded-3xl bg-white/95 p-6 shadow-2xl">
			<Image
				src="/logos/Renard-logo.png"
				alt="Logo ZouuSafe"
				width={230}
				height={95}
				className="mx-auto"
				priority
			/>

			<nav className="mt-10 space-y-3 text-sm font-black">
				<Link
					href="/parent-dashboard"
					className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
						isDashboardActive
							? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg"
							: "text-slate-800 hover:bg-violet-50"
					}`}
				>
					<Home
						size={20}
						className={
							isDashboardActive
								? "text-white"
								: "text-slate-500"
						}
					/>
					Tableau de bord
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
							className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
								isActive
									? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg"
									: "text-slate-800 hover:bg-violet-50"
							}`}
						>
							<Icon
								size={20}
								className={
									isActive
										? "text-white"
										: "text-slate-500"
								}
							/>

							{item.label}
						</Link>
					);
				})}
			</nav>

			<section className="mt-auto rounded-3xl border border-violet-100 bg-white p-4 text-center shadow-sm">
				<Image
					src="/mascottes/renard-shield.png"
					alt="Protection ZouuSafe"
					width={150}
					height={150}
					className="mx-auto"
				/>

				<p className="mt-3 font-black">
					ZouuSafe protège vos enfants en ligne
				</p>

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