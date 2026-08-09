"use client";

import {
	BarChart3,
	Clock3,
	HelpCircle,
	History,
	Home,
	Menu,
	Settings,
	ShieldBan,
	UserRound,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MobileParentMenuProps = {
	parentName: string;
	parentAvatar: string | null;
};

const links = [
	{
		label: "Tableau de bord",
		href: "/parent-dashboard",
		icon: Home,
	},
	{
		label: "Mes enfants",
		href: "/parent-dashboard/children",
		icon: UserRound,
	},
	{
		label: "Historique",
		href: "/parent-dashboard/history",
		icon: History,
	},
	{
		label: "Sites bloqués",
		href: "/parent-dashboard/blocked",
		icon: ShieldBan,
	},
	{
		label: "Temps d’écran",
		href: "/parent-dashboard/screen-time",
		icon: Clock3,
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
		icon: HelpCircle,
	},
];

export default function MobileParentMenu({
	parentName,
	parentAvatar,
}: MobileParentMenuProps) {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "";

		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	function isActive(href: string) {
		if (href === "/parent-dashboard") {
			return pathname === href;
		}

		return pathname.startsWith(href);
	}

	return (
		<>
			{!isOpen && (
	<button
		type="button"
		onClick={() => setIsOpen(true)}
		aria-label="Ouvrir le menu"
		aria-expanded={isOpen}
		className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white shadow-[0_12px_35px_rgba(124,58,237,0.35)] lg:hidden"
	>
		<Menu size={22} aria-hidden="true" />
	</button>
)}

			{isOpen && (
				<div className="fixed inset-0 z-[100] lg:hidden">
					<button
						type="button"
						aria-label="Fermer le menu"
						onClick={() => setIsOpen(false)}
						className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
					/>

					<aside className="absolute bottom-0 left-0 top-0 flex w-[86%] max-w-[340px] flex-col overflow-y-auto rounded-r-[32px] border-r border-white/80 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">
						<div className="flex items-center justify-between">
							<Image
								src="/logos/Renard-logo.png"
								alt="ZouuSafe"
								width={170}
								height={70}
								priority
								className="h-auto w-[145px]"
							/>

							<button
								type="button"
								onClick={() => setIsOpen(false)}
								aria-label="Fermer le menu"
								className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600"
							>
								<X size={20} aria-hidden="true" />
							</button>
						</div>

						<div className="mt-6 flex items-center gap-3 rounded-[22px] bg-gradient-to-r from-violet-50 to-blue-50 p-3">
							{parentAvatar ? (
								<Image
									src={parentAvatar}
									alt={`Photo de profil de ${parentName}`}
									width={50}
									height={50}
									className="h-[50px] w-[50px] rounded-full object-cover"
								/>
							) : (
								<div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-violet-600 text-lg font-black text-white">
									{parentName.charAt(0).toUpperCase()}
								</div>
							)}

							<div className="min-w-0">
								<p className="truncate text-sm font-black text-slate-900">
									Bonjour {parentName}
								</p>
								<p className="text-xs font-semibold text-slate-500">
									Compte parent
								</p>
							</div>
						</div>

						<nav
							aria-label="Navigation parent mobile"
							className="mt-6 space-y-2"
						>
							{links.map((link) => {
								const Icon = link.icon;
								const active = isActive(link.href);

								return (
									<Link
										key={link.href}
										href={link.href}
										onClick={() => setIsOpen(false)}
										className={`flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-black transition ${
											active
												? "bg-violet-600 text-white shadow-lg shadow-violet-200"
												: "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
										}`}
									>
										<Icon
											size={20}
											aria-hidden="true"
										/>

										{link.label}
									</Link>
								);
							})}
						</nav>

						<div className="mt-auto pt-6">
							<div className="rounded-[22px] bg-gradient-to-br from-violet-100 to-blue-100 p-4">
								<p className="text-sm font-black text-slate-900">
									ZouuSafe
								</p>

								<p className="mt-1 text-xs leading-5 text-slate-600">
									La sécurité numérique de votre famille.
								</p>
							</div>
						</div>
					</aside>
				</div>
			)}
		</>
	);
}