"use client";

import {
	BarChart3,
	CheckCircle2,
	ChevronRight,
	CircleHelp,
	Clock3,
	Home,
	Search,
	Settings,
	ShieldCheck,
	UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import ParentProfileModal from "@/components/dashboard/ParentProfileModal";

type SidebarProps = {
	parentName?: string;
	parentLastName?: string | null;
	parentEmail?: string;
	parentAvatar?: string | null;
};

const menuItems = [
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
		icon: Search,
	},
	{
		label: "Sites bloqués",
		href: "/parent-dashboard/blocked",
		icon: ShieldCheck,
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
		icon: CircleHelp,
	},
];

function getImagePath(path: string) {
	return path.startsWith("/") ? path : `/${path}`;
}

export default function Sidebar({
	parentName,
	parentLastName,
	parentEmail,
	parentAvatar,
}: SidebarProps) {
	const pathname = usePathname();
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	const safeParentName = parentName?.trim() || "Parent";
	const safeParentLastName = parentLastName?.trim() || "";
	const safeParentEmail = parentEmail?.trim() || "";
	const parentInitial = safeParentName.charAt(0).toUpperCase() || "P";

	function isCurrentPage(href: string) {
		if (href === "/parent-dashboard") {
			return pathname === href;
		}

		return pathname === href || pathname.startsWith(`${href}/`);
	}

	return (
		<>
			<aside className="sticky top-5 hidden min-h-[calc(100vh-2.5rem)] w-[295px] shrink-0 overflow-visible rounded-[34px] border border-white/80 bg-white/80 px-4 py-5 shadow-[0_24px_70px_rgba(91,33,182,0.14)] backdrop-blur-2xl lg:flex lg:flex-col">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-200/35 blur-3xl"
				/>

				<div
					aria-hidden="true"
					className="pointer-events-none absolute -bottom-20 -right-16 h-52 w-52 rounded-full bg-blue-200/25 blur-3xl"
				/>

				<header className="relative pb-3">
					<Link
						href="/"
						aria-label="Retour à l’accueil ZouuSafe"
						className="block"
					>
						<Image
							src="/logos/Renard-logo.png"
							alt="Logo ZouuSafe"
							width={230}
							height={95}
							priority
							className="mx-auto h-auto w-[205px] transition-transform duration-300 hover:scale-[1.03]"
						/>
					</Link>
				</header>

				<button
					type="button"
					onClick={() => setIsProfileOpen(true)}
					aria-label="Ouvrir mon profil parent"
					className="relative mx-1 rounded-[24px] border border-white/80 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-blue-100 p-3.5 text-left shadow-[0_14px_35px_rgba(124,58,237,0.13)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(124,58,237,0.18)]"
				>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -right-5 -top-6 h-24 w-24 rounded-full bg-fuchsia-200/35 blur-2xl"
					/>

					<div className="relative flex items-center gap-3">
						<div className="relative shrink-0">
							<div
								aria-hidden="true"
								className="absolute inset-0 rounded-full bg-violet-300/50 blur-md"
							/>

							{parentAvatar ? (
								<Image
									src={getImagePath(parentAvatar)}
									alt={`Photo de profil de ${safeParentName}`}
									width={64}
									height={64}
									className="relative h-[60px] w-[60px] rounded-full border-4 border-white object-cover shadow-lg"
								/>
							) : (
								<div
									role="img"
									aria-label={`Avatar de ${safeParentName}`}
									className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-violet-500 to-blue-500 text-xl font-black text-white shadow-lg"
								>
									{parentInitial}
								</div>
							)}

							<span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
								<span className="h-1.5 w-1.5 rounded-full bg-white" />
							</span>
						</div>

						<div className="min-w-0">
							<p className="text-xs font-bold text-violet-600">
								Bonjour
							</p>

							<h2 className="truncate text-lg font-black text-slate-950">
								{safeParentName}
							</h2>

							<div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
								<span>Compte parent</span>

								<ShieldCheck
									size={14}
									aria-hidden="true"
									className="text-violet-500"
								/>
							</div>
						</div>
					</div>
				</button>

				<nav
					aria-label="Navigation du tableau de bord"
					className="relative mt-4 px-1"
				>
					<p className="mb-2 px-2 text-[11px] font-black uppercase tracking-[0.16em] text-violet-500">
						Menu principal
					</p>

					<ul className="space-y-1">
						{menuItems.map((item) => {
							const Icon = item.icon;
							const isActive = isCurrentPage(item.href);

							return (
								<li key={item.href}>
									<Link
										href={item.href}
										aria-current={isActive ? "page" : undefined}
										className={`group flex min-h-[42px] items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-300 ${
											isActive
												? "bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-[0_10px_24px_rgba(124,58,237,0.28)]"
												: "text-slate-700 hover:translate-x-1 hover:bg-violet-50/90 hover:text-violet-700"
										}`}
									>
										<span
											className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
												isActive
													? "bg-white/20 text-white"
													: "bg-white text-slate-500 shadow-sm group-hover:bg-violet-100 group-hover:text-violet-600"
											}`}
										>
											<Icon
												size={17}
												strokeWidth={2.2}
												aria-hidden="true"
											/>
										</span>

										<span className="flex-1 text-[13px] font-bold">
											{item.label}
										</span>

										<ChevronRight
											size={15}
											aria-hidden="true"
											className={`transition-all duration-300 ${
												isActive
													? "translate-x-0 opacity-100"
													: "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
											}`}
										/>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				<section className="relative mx-1 mt-5 overflow-hidden rounded-[24px] border border-violet-100 bg-gradient-to-b from-white to-violet-50/70 px-4 pb-4 pt-3 text-center shadow-[0_14px_32px_rgba(91,33,182,0.10)]">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute left-1/2 top-5 h-28 w-28 -translate-x-1/2 rounded-full bg-violet-200/30 blur-2xl"
					/>

					<div className="relative">
						<Image
							src="/mascottes/renard-shield.png"
							alt="Renard protecteur ZouuSafe"
							width={150}
							height={135}
							className="mx-auto h-[118px] w-auto object-contain drop-shadow-lg transition-transform duration-300 hover:scale-[1.04]"
						/>

						<h3 className="mt-1 text-sm font-black leading-5 text-slate-900">
							ZouuSafe protège
							<br />
							vos enfants en ligne
						</h3>

						<p className="mx-auto mt-2 max-w-[205px] text-[11px] leading-4 text-slate-500">
							Toutes les recherches sont filtrées et sécurisées.
						</p>

						<div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-black text-emerald-600">
							<CheckCircle2
								size={16}
								strokeWidth={2.6}
								aria-hidden="true"
							/>

							Protection active
						</div>
					</div>
				</section>
			</aside>

			<ParentProfileModal
				isOpen={isProfileOpen}
				onClose={() => setIsProfileOpen(false)}
				parent={{
					firstName: safeParentName,
					lastName: safeParentLastName,
					email: safeParentEmail,
					avatarUrl: parentAvatar ?? null,
				}}
			/>
		</>
	);
}