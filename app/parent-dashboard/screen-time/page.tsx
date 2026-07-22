import {
	Clock3,
	ShieldCheck,
	TimerReset,
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

	const response = await fetch(
		"http://localhost:3000/api/screen-time",
		{
			cache: "no-store",
			headers: {
				Cookie: `zouusafe_session=${sessionCookie.value}`,
			},
		},
	);

	if (!response.ok) {
		throw new Error(
			"Impossible de récupérer le temps d’écran.",
		);
	}

	const data =
		(await response.json()) as ScreenTimeResponse;

	return data.children;
}

export default async function ScreenTimePage() {
	const children = await getScreenTime();

	const totalUsed = children.reduce(
		(total, child) =>
			total + (child.screen_time_used ?? 0),
		0,
	);

	const totalLimit = children.reduce(
		(total, child) =>
			total + (child.screen_time_limit ?? 120),
		0,
	);

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-6 text-slate-900">
			<section className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
				<Sidebar />

				<section className="space-y-6">
					<header className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-xl backdrop-blur-xl">
						<div className="flex items-center gap-4">
							<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
								<Clock3 size={28} />
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

					<section className="grid gap-4 sm:grid-cols-3">
						<article className="rounded-3xl bg-white/90 p-5 shadow-xl">
							<div className="flex items-center gap-3">
								<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-600">
									<Clock3 size={22} />
								</span>

								<div>
									<p className="text-sm font-bold text-slate-500">
										Temps utilisé
									</p>

									<p className="mt-1 text-2xl font-black">
										{totalUsed} min
									</p>
								</div>
							</div>
						</article>

						<article className="rounded-3xl bg-white/90 p-5 shadow-xl">
							<div className="flex items-center gap-3">
								<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
									<TimerReset size={22} />
								</span>

								<div>
									<p className="text-sm font-bold text-slate-500">
										Limite totale
									</p>

									<p className="mt-1 text-2xl font-black">
										{totalLimit} min
									</p>
								</div>
							</div>
						</article>

						<article className="rounded-3xl bg-white/90 p-5 shadow-xl">
							<div className="flex items-center gap-3">
								<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
									<ShieldCheck size={22} />
								</span>

								<div>
									<p className="text-sm font-bold text-slate-500">
										Profils suivis
									</p>

									<p className="mt-1 text-2xl font-black">
										{children.length}
									</p>
								</div>
							</div>
						</article>
					</section>

					<section className="grid gap-5 lg:grid-cols-2">
						{children.map((child) => {
							const limit =
								child.screen_time_limit ?? 120;

							const used =
								child.screen_time_used ?? 0;

							const progress =
								limit > 0
									? Math.min(
											100,
											Math.round(
												(used / limit) * 100,
											),
										)
									: 0;

							const avatar =
								child.avatar_url ??
								"/avatars-profil/fille-15.png";

							const avatarSrc = avatar.startsWith("/")
								? avatar
								: `/${avatar}`;

							return (
								<article
									key={child.child_id}
									className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-xl backdrop-blur-xl"
								>
									<div className="flex items-center justify-between gap-4">
										<div className="flex items-center gap-4">
											<Image
												src={avatarSrc}
												alt={`Avatar de ${child.first_name}`}
												width={88}
												height={88}
												className="h-20 w-20 rounded-full border-4 border-green-100 object-cover shadow-md"
											/>

											<div>
												<h2 className="text-2xl font-black">
													{child.first_name}
												</h2>

												<p className="mt-1 text-sm font-semibold capitalize text-slate-500">
													Filtre :{" "}
													{child.filter_level ??
														"standard"}
												</p>

												<span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
													Safe Search{" "}
													{child.safe_search
														? "activé"
														: "désactivé"}
												</span>
											</div>
										</div>

										<strong className="text-3xl font-black text-green-600">
											{progress} %
										</strong>
									</div>

									<div className="mt-6 rounded-2xl bg-green-50 p-5">
										<div className="flex items-center justify-between gap-4">
											<div>
												<p className="font-black">
													Temps d’écran aujourd’hui
												</p>

												<p className="mt-1 text-sm text-slate-500">
													{used} min utilisées sur{" "}
													{limit} min
												</p>
											</div>

											<Clock3
												size={24}
												className="text-green-600"
											/>
										</div>

										<div className="mt-5 h-4 overflow-hidden rounded-full bg-white shadow-inner">
											<div
												className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600"
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