import {
	CheckCircle2,
	Clock3,
	Hourglass,
	ShieldCheck,
	TimerReset,
	UsersRound,
} from "lucide-react";
import Image from "next/image";
import { cookies } from "next/headers";

import Sidebar from "@/components/dashboard/Sidebar";

type ChildScreenTime = {
	child_id: number;
	first_name: string;
	avatar_url: string | null;
	screen_time_limit: number | null;
	screen_time_used: number | null;
	filter_level: string | null;
	safe_search: boolean | null;
};

type ScreenTimeResponse = {
	children: ChildScreenTime[];
};

async function getScreenTime(): Promise<ChildScreenTime[]> {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("zouusafe_session");

	if (!sessionCookie) {
		throw new Error("Session utilisateur introuvable.");
	}

	const response = await fetch("http://localhost:3000/api/screen-time", {
		cache: "no-store",
		headers: {
			Cookie: `zouusafe_session=${sessionCookie.value}`,
		},
	});

	if (!response.ok) {
		throw new Error("Impossible de récupérer le temps d’écran.");
	}

	const data = (await response.json()) as ScreenTimeResponse;

	return data.children;
}

function getStatus(progress: number) {
	if (progress >= 100) {
		return {
			label: "Limite atteinte",
			text: "text-red-600",
			badge: "bg-red-100 text-red-700",
			bar: "from-red-400 to-rose-500",
			background: "bg-red-50",
		};
	}

	if (progress >= 80) {
		return {
			label: "Attention",
			text: "text-orange-600",
			badge: "bg-orange-100 text-orange-700",
			bar: "from-orange-400 to-amber-500",
			background: "bg-orange-50",
		};
	}

	return {
		label: "Temps respecté",
		text: "text-emerald-600",
		badge: "bg-emerald-100 text-emerald-700",
		bar: "from-emerald-400 to-green-500",
		background: "bg-emerald-50",
	};
}

export default async function ScreenTimePage() {
	const children = await getScreenTime();

	const totalUsed = children.reduce(
		(total, child) => total + (child.screen_time_used ?? 0),
		0,
	);

	const totalLimit = children.reduce(
		(total, child) => total + (child.screen_time_limit ?? 120),
		0,
	);

	const totalRemaining = Math.max(totalLimit - totalUsed, 0);

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-6 text-slate-900">
			<section className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
				<Sidebar />

				<section className="space-y-6">
					<header className="rounded-[30px] border border-white/80 bg-white/90 p-7 shadow-xl backdrop-blur-xl">
						<div className="flex items-center gap-4">
							<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
								<Clock3 size={28} aria-hidden="true" />
							</span>

							<div>
								<p className="text-sm font-black uppercase tracking-[0.15em] text-violet-500">
									Suivi quotidien
								</p>

								<h1 className="mt-1 text-3xl font-black">
									Temps d’écran
								</h1>

								<p className="mt-2 text-sm text-slate-500">
									Suivez le temps utilisé et les limites de chaque enfant.
								</p>
							</div>
						</div>
					</header>

					<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						<article className="rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-xl">
							<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
								<Clock3 size={22} aria-hidden="true" />
							</span>

							<p className="mt-4 text-3xl font-black">
								{totalUsed} min
							</p>

							<p className="mt-1 font-black text-slate-700">
								Temps utilisé
							</p>
						</article>

						<article className="rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-xl">
							<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
								<Hourglass size={22} aria-hidden="true" />
							</span>

							<p className="mt-4 text-3xl font-black">
								{totalRemaining} min
							</p>

							<p className="mt-1 font-black text-slate-700">
								Temps restant
							</p>
						</article>

						<article className="rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-xl">
							<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
								<TimerReset size={22} aria-hidden="true" />
							</span>

							<p className="mt-4 text-3xl font-black">
								{totalLimit} min
							</p>

							<p className="mt-1 font-black text-slate-700">
								Limite totale
							</p>
						</article>

						<article className="rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-xl">
							<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
								<UsersRound size={22} aria-hidden="true" />
							</span>

							<p className="mt-4 text-3xl font-black">
								{children.length}
							</p>

							<p className="mt-1 font-black text-slate-700">
								Profils suivis
							</p>
						</article>
					</section>

					<section className="grid gap-5 lg:grid-cols-2">
						{children.map((child) => {
							const limit = child.screen_time_limit ?? 120;
							const used = child.screen_time_used ?? 0;
							const remaining = Math.max(limit - used, 0);

							const progress =
								limit > 0
									? Math.min(100, Math.round((used / limit) * 100))
									: 0;

							const status = getStatus(progress);

							const avatar =
								child.avatar_url ?? "/avatars-profil/fille-15.png";

							const avatarSrc = avatar.startsWith("/")
								? avatar
								: `/${avatar}`;

							return (
								<article
									key={child.child_id}
									className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl"
								>
									<div className="flex items-start justify-between gap-4">
										<div className="flex items-center gap-4">
											<Image
												src={avatarSrc}
												alt={`Avatar de ${child.first_name}`}
												width={88}
												height={88}
												className="h-20 w-20 rounded-full border-4 border-violet-100 object-cover shadow-md"
											/>

											<div>
												<h2 className="text-2xl font-black">
													{child.first_name}
												</h2>

												<p className="mt-1 text-sm font-semibold capitalize text-slate-500">
													Filtre : {child.filter_level ?? "standard"}
												</p>

												<span
													className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black ${
														child.safe_search
															? "bg-emerald-100 text-emerald-700"
															: "bg-red-100 text-red-700"
													}`}
												>
													Safe Search{" "}
													{child.safe_search ? "activé" : "désactivé"}
												</span>
											</div>
										</div>

										<div className="text-right">
											<strong
												className={`text-3xl font-black ${status.text}`}
											>
												{progress} %
											</strong>

											<p
												className={`mt-2 rounded-full px-3 py-1 text-xs font-black ${status.badge}`}
											>
												{status.label}
											</p>
										</div>
									</div>

									<div
										className={`mt-6 rounded-2xl p-5 ${status.background}`}
									>
										<div className="flex items-center justify-between gap-4">
											<div>
												<p className="font-black">
													Temps d’écran aujourd’hui
												</p>

												<p className="mt-1 text-sm text-slate-500">
													{used} min utilisées sur {limit} min
												</p>
											</div>

											<Clock3
												size={24}
												aria-hidden="true"
												className={status.text}
											/>
										</div>

										<div className="mt-5 h-4 overflow-hidden rounded-full bg-white shadow-inner">
											<div
												className={`h-full rounded-full bg-gradient-to-r ${status.bar}`}
												style={{ width: `${progress}%` }}
											/>
										</div>

										<p className="mt-4 text-sm font-black text-slate-700">
											{remaining > 0
												? `${remaining} minutes restantes`
												: "Aucun temps restant"}
										</p>
									</div>
								</article>
							);
						})}
					</section>

					<article className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
						<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
							<div className="flex items-start gap-4">
								<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
									<ShieldCheck size={24} aria-hidden="true" />
								</span>

								<div>
									<p className="text-sm font-black uppercase tracking-[0.14em] text-violet-500">
										Bilan quotidien
									</p>

									<h2 className="mt-1 text-xl font-black">
										Résumé du temps d’écran
									</h2>
								</div>
							</div>

							<ul className="grid gap-3 sm:grid-cols-2">
								<li className="flex items-center gap-2 text-sm font-bold text-slate-600">
									<CheckCircle2
										size={18}
										className="text-emerald-500"
										aria-hidden="true"
									/>
									Contrôle parental actif
								</li>

								<li className="flex items-center gap-2 text-sm font-bold text-slate-600">
									<CheckCircle2
										size={18}
										className="text-emerald-500"
										aria-hidden="true"
									/>
									Limites suivies
								</li>

								<li className="flex items-center gap-2 text-sm font-bold text-slate-600">
									<CheckCircle2
										size={18}
										className="text-emerald-500"
										aria-hidden="true"
									/>
									Safe Search vérifié
								</li>

								<li className="flex items-center gap-2 text-sm font-bold text-slate-600">
									<CheckCircle2
										size={18}
										className="text-emerald-500"
										aria-hidden="true"
									/>
									Données actualisées
								</li>
							</ul>
						</div>
					</article>
				</section>
			</section>
		</main>
	);
}