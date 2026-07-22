import {
	BarChart3,
	Bell,
	Clock3,
	Search,
	ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import { cookies } from "next/headers";

import Sidebar from "@/components/dashboard/Sidebar";

type ReportChild = {
	child_id: number;
	first_name: string;
	avatar_url: string | null;
	searches: number;
	blocked_sites: number;
	alerts: number;
	screen_time_used: number;
	screen_time_limit: number;
};

type ReportsResponse = {
	summary: {
		searches: number;
		blockedSites: number;
		alerts: number;
		screenTimeUsed: number;
		screenTimeLimit: number;
	};
	children: ReportChild[];
};

async function getReports(): Promise<ReportsResponse> {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("zouusafe_session");

	if (!sessionCookie) {
		throw new Error("Session utilisateur introuvable.");
	}

	const response = await fetch("http://localhost:3000/api/reports", {
		cache: "no-store",
		headers: {
			Cookie: `zouusafe_session=${sessionCookie.value}`,
		},
	});

	if (!response.ok) {
		throw new Error("Impossible de récupérer les rapports.");
	}

	return response.json();
}

export default async function ReportsPage() {
	const reports = await getReports();

	const totalProgress =
		reports.summary.screenTimeLimit > 0
			? Math.min(
					100,
					Math.round(
						(reports.summary.screenTimeUsed /
							reports.summary.screenTimeLimit) *
							100,
					),
				)
			: 0;

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-6 text-slate-900">
			<section className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
				<Sidebar />

				<section className="space-y-6">
					<header className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-xl backdrop-blur-xl">
						<div className="flex items-center gap-4">
							<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
								<BarChart3 size={28} />
							</span>

							<div>
								<p className="text-sm font-black uppercase tracking-[0.15em] text-violet-500">
									Analyse de l’activité
								</p>

								<h1 className="mt-1 text-3xl font-black">
									Rapports
								</h1>

								<p className="mt-2 text-sm text-slate-500">
									Consultez les principales données de protection.
								</p>
							</div>
						</div>
					</header>

					<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						<article className="rounded-3xl bg-white/90 p-5 shadow-xl">
							<Search className="text-blue-600" />
							<p className="mt-4 text-3xl font-black">
								{reports.summary.searches}
							</p>
							<p className="mt-1 text-sm font-bold text-slate-500">
								Recherches
							</p>
						</article>

						<article className="rounded-3xl bg-white/90 p-5 shadow-xl">
							<ShieldAlert className="text-pink-600" />
							<p className="mt-4 text-3xl font-black">
								{reports.summary.blockedSites}
							</p>
							<p className="mt-1 text-sm font-bold text-slate-500">
								Sites bloqués
							</p>
						</article>

						<article className="rounded-3xl bg-white/90 p-5 shadow-xl">
							<Bell className="text-orange-600" />
							<p className="mt-4 text-3xl font-black">
								{reports.summary.alerts}
							</p>
							<p className="mt-1 text-sm font-bold text-slate-500">
								Alertes
							</p>
						</article>

						<article className="rounded-3xl bg-white/90 p-5 shadow-xl">
							<Clock3 className="text-green-600" />
							<p className="mt-4 text-3xl font-black">
								{reports.summary.screenTimeUsed} min
							</p>
							<p className="mt-1 text-sm font-bold text-slate-500">
								Temps utilisé
							</p>
						</article>
					</section>

					<section className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
						<div className="flex items-center justify-between gap-4">
							<div>
								<h2 className="text-2xl font-black">
									Temps d’écran global
								</h2>

								<p className="mt-1 text-sm text-slate-500">
									{reports.summary.screenTimeUsed} min utilisées sur{" "}
									{reports.summary.screenTimeLimit} min
								</p>
							</div>

							<strong className="text-2xl font-black text-violet-600">
								{totalProgress} %
							</strong>
						</div>

						<div className="mt-5 h-4 overflow-hidden rounded-full bg-violet-50">
							<div
								className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600"
								style={{ width: `${totalProgress}%` }}
							/>
						</div>
					</section>

					<section className="grid gap-5 lg:grid-cols-2">
						{reports.children.map((child) => {
							const avatar =
								child.avatar_url ??
								"/avatars-profil/fille-15.png";

							const avatarSrc = avatar.startsWith("/")
								? avatar
								: `/${avatar}`;

							const progress =
								child.screen_time_limit > 0
									? Math.min(
											100,
											Math.round(
												(child.screen_time_used /
													child.screen_time_limit) *
													100,
											),
										)
									: 0;

							return (
								<article
									key={child.child_id}
									className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-xl"
								>
									<div className="flex items-center gap-4">
										<Image
											src={avatarSrc}
											alt={`Avatar de ${child.first_name}`}
											width={88}
											height={88}
											className="h-20 w-20 rounded-full border-4 border-violet-100 object-cover"
										/>

										<div>
											<h2 className="text-2xl font-black">
												{child.first_name}
											</h2>

											<p className="mt-1 text-sm text-slate-500">
												Rapport individuel
											</p>
										</div>
									</div>

									<div className="mt-6 grid grid-cols-3 gap-3">
										<div className="rounded-2xl bg-blue-50 p-4 text-center">
											<p className="text-2xl font-black text-blue-700">
												{child.searches}
											</p>
											<p className="mt-1 text-xs font-bold text-slate-500">
												Recherches
											</p>
										</div>

										<div className="rounded-2xl bg-pink-50 p-4 text-center">
											<p className="text-2xl font-black text-pink-700">
												{child.blocked_sites}
											</p>
											<p className="mt-1 text-xs font-bold text-slate-500">
												Bloqués
											</p>
										</div>

										<div className="rounded-2xl bg-orange-50 p-4 text-center">
											<p className="text-2xl font-black text-orange-700">
												{child.alerts}
											</p>
											<p className="mt-1 text-xs font-bold text-slate-500">
												Alertes
											</p>
										</div>
									</div>

									<div className="mt-5 rounded-2xl bg-green-50 p-4">
										<div className="flex items-center justify-between">
											<p className="font-black">
												Temps d’écran
											</p>

											<strong className="text-green-700">
												{progress} %
											</strong>
										</div>

										<p className="mt-1 text-sm text-slate-500">
											{child.screen_time_used} min sur{" "}
											{child.screen_time_limit} min
										</p>

										<div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
											<div
												className="h-full rounded-full bg-green-500"
												style={{
													width: `${progress}%`,
												}}
											/>
										</div>
									</div>
								</article>
							);
						})}
					</section>
				</section>
			</section>
		</main>
	);
}