"use client";

import { Bell, Heart, LogOut, Settings, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DashboardHeaderProps = {
	parentName: string;
	childName: string;
};

export default function DashboardHeader({
	parentName,
	childName,
}: DashboardHeaderProps) {
	const router = useRouter();

	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const [notificationCount, setNotificationCount] = useState(3);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	function handleNotifications() {
		setNotificationsOpen((open) => !open);
		setNotificationCount(0);
	}

	async function handleLogout() {
		try {
			setIsLoggingOut(true);

			const response = await fetch("/api/logout", {
				method: "POST",
			});

			if (!response.ok) {
				throw new Error("Impossible de se déconnecter.");
			}

			router.push("/login");
			router.refresh();
		} catch (error) {
			console.error(error);
			setIsLoggingOut(false);
		}
	}

	return (
		<header className="relative z-20 min-h-[120px] px-2 pt-3">
			<div className="flex items-start justify-between gap-6">
				<div className="pt-2">
					<h1 className="flex items-center gap-1 whitespace-nowrap text-[26px] font-black tracking-tight text-slate-950 sm:gap-2 sm:text-3xl lg:text-4xl">
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

					<div className="relative mt-2 flex items-center gap-2">
						<button
							type="button"
							aria-label="Voir les notifications"
							onClick={handleNotifications}
							className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-[0_8px_24px_rgba(30,41,59,0.10)] transition hover:-translate-y-0.5 hover:text-violet-600"
						>
							<Bell size={20} />

							{notificationCount > 0 && (
								<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
									{notificationCount}
								</span>
							)}
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
							onClick={handleLogout}
							disabled={isLoggingOut}
							className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-500 shadow-[0_8px_24px_rgba(30,41,59,0.10)] transition hover:-translate-y-0.5 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<LogOut size={20} />
						</button>

						{notificationsOpen && (
							<div className="absolute right-0 top-16 z-50 w-80 rounded-3xl border border-violet-100 bg-white p-4 shadow-2xl">
								<div className="mb-3 flex items-center justify-between">
									<h2 className="font-black text-slate-900">
										Notifications
									</h2>

									<button
										type="button"
										aria-label="Fermer les notifications"
										onClick={() => setNotificationsOpen(false)}
										className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
									>
										<X size={17} />
									</button>
								</div>

								<div className="space-y-2 text-sm text-slate-600">
									<p className="rounded-2xl bg-violet-50 p-3">
										Une activité récente a été détectée.
									</p>

									<p className="rounded-2xl bg-rose-50 p-3">
										Un contenu a été bloqué par ZouuSafe.
									</p>

									<p className="rounded-2xl bg-blue-50 p-3">
										Le temps d’écran est disponible dans votre tableau
										de bord.
									</p>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="relative flex items-center gap-2 lg:hidden">
					<button
						type="button"
						aria-label="Voir les notifications"
						onClick={handleNotifications}
						className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"
					>
						<Bell size={18} />

						{notificationCount > 0 && (
							<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
								{notificationCount}
							</span>
						)}
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
						onClick={handleLogout}
						disabled={isLoggingOut}
						className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-500 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
					>
						<LogOut size={18} />
					</button>

					{notificationsOpen && (
						<div className="absolute right-0 top-14 z-50 w-72 rounded-3xl border border-violet-100 bg-white p-4 shadow-2xl">
							<div className="mb-3 flex items-center justify-between">
								<h2 className="font-black text-slate-900">
									Notifications
								</h2>

								<button
									type="button"
									aria-label="Fermer les notifications"
									onClick={() => setNotificationsOpen(false)}
									className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
								>
									<X size={17} />
								</button>
							</div>

							<div className="space-y-2 text-sm text-slate-600">
								<p className="rounded-2xl bg-violet-50 p-3">
									Une activité récente a été détectée.
								</p>

								<p className="rounded-2xl bg-rose-50 p-3">
									Un contenu a été bloqué par ZouuSafe.
								</p>

								<p className="rounded-2xl bg-blue-50 p-3">
									Le temps d’écran est disponible dans votre tableau de
									bord.
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}