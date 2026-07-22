import {
	CalendarDays,
	ShieldAlert,
	UserRound,
} from "lucide-react";
import { cookies } from "next/headers";

import Sidebar from "@/components/dashboard/Sidebar";

type BlockedSite = {
	blocked_content_id: number;
	content_name: string;
	reason: string;
	blocked_at: string;
	child_id: number;
	first_name: string;
	avatar_url: string | null;
};

type BlockedResponse = {
	blockedSites: BlockedSite[];
};

async function getBlockedSites(): Promise<BlockedSite[]> {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("zouusafe_session");

	if (!sessionCookie) {
		throw new Error("Session utilisateur introuvable.");
	}

	const response = await fetch(
		"http://localhost:3000/api/blocked",
		{
			cache: "no-store",
			headers: {
				Cookie: `zouusafe_session=${sessionCookie.value}`,
			},
		},
	);

	if (!response.ok) {
		throw new Error(
			"Impossible de récupérer les sites bloqués.",
		);
	}

	const data = (await response.json()) as BlockedResponse;

	return data.blockedSites;
}

function formatDate(date: string) {
	return new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}

export default async function BlockedSitesPage() {
	const blockedSites = await getBlockedSites();

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-6 text-slate-900">
			<section className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
				<Sidebar />

				<section className="space-y-6">
					<header className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-xl backdrop-blur-xl">
						<div className="flex items-center gap-4">
							<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
								<ShieldAlert size={28} />
							</span>

							<div>
								<p className="text-sm font-black uppercase tracking-[0.15em] text-violet-500">
									Protection des contenus
								</p>

								<h1 className="mt-1 text-3xl font-black">
									Sites bloqués
								</h1>

								<p className="mt-2 text-sm text-slate-500">
									Consultez les contenus bloqués pour vos enfants.
								</p>
							</div>
						</div>
					</header>

					<section className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
						<div className="grid gap-4 sm:grid-cols-3">
							<div className="rounded-2xl bg-pink-50 p-4">
								<p className="text-sm font-bold text-slate-500">
									Contenus bloqués
								</p>

								<p className="mt-2 text-3xl font-black text-pink-700">
									{blockedSites.length}
								</p>
							</div>

							<div className="rounded-2xl bg-violet-50 p-4">
								<p className="text-sm font-bold text-slate-500">
									Enfants protégés
								</p>

								<p className="mt-2 text-3xl font-black text-violet-700">
									2
								</p>
							</div>

							<div className="rounded-2xl bg-green-50 p-4">
								<p className="text-sm font-bold text-slate-500">
									Filtrage
								</p>

								<p className="mt-2 text-lg font-black text-green-700">
									Actif
								</p>
							</div>
						</div>

						<div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
							<div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-4 bg-pink-50 px-5 py-4 text-sm font-black text-slate-700">
								<span>Site</span>
								<span>Raison</span>
								<span>Enfant</span>
								<span>Date</span>
							</div>

							{blockedSites.length === 0 ? (
								<div className="p-10 text-center">
									<ShieldAlert
										size={42}
										className="mx-auto text-slate-300"
									/>

									<p className="mt-4 font-bold text-slate-500">
										Aucun site bloqué.
									</p>
								</div>
							) : (
								<ul>
									{blockedSites.map((site) => (
										<li
											key={site.blocked_content_id}
											className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-4 border-t border-slate-100 px-5 py-4"
										>
											<div className="flex items-center gap-3">
												<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
													<ShieldAlert size={17} />
												</span>

												<p className="font-black text-slate-900">
													{site.content_name}
												</p>
											</div>

											<p className="text-sm font-semibold text-slate-600">
												{site.reason}
											</p>

											<div className="flex items-center gap-2">
												<UserRound
													size={17}
													className="text-violet-500"
												/>

												<span className="font-bold text-slate-700">
													{site.first_name}
												</span>
											</div>

											<div className="flex items-center gap-2 text-sm text-slate-500">
												<CalendarDays
													size={17}
													className="text-slate-400"
												/>

												{formatDate(site.blocked_at)}
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					</section>
				</section>
			</section>
		</main>
	);
}