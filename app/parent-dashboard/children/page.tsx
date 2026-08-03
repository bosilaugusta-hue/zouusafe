import { Eye, Pencil, Plus, UserRound } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

type Child = {
	child_id: number;
	first_name: string;
	birth_date: string;
	avatar_url: string | null;
	screen_time_limit: number | null;
	screen_time_used: number | null;
	filter_level: string | null;
};

type ChildrenResponse = {
	children: Child[];
};

async function getChildren(): Promise<Child[]> {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("zouusafe_session");

	if (!sessionCookie) {
		throw new Error("Session utilisateur introuvable.");
	}

	const response = await fetch("http://localhost:3000/api/children", {
		cache: "no-store",
		headers: {
			Cookie: `zouusafe_session=${sessionCookie.value}`,
		},
	});

	if (!response.ok) {
		throw new Error("Impossible de récupérer les enfants.");
	}

	const data = (await response.json()) as ChildrenResponse;

	return data.children;
}

function getAvatarPath(avatarUrl: string | null) {
	if (!avatarUrl) {
		return "/avatars-profil/fille-15.png";
	}

	return avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`;
}

function formatFilterLevel(filterLevel: string | null) {
	if (!filterLevel) {
		return "Standard";
	}

	return (
		filterLevel.charAt(0).toUpperCase() +
		filterLevel.slice(1).toLowerCase()
	);
}

export default async function ChildrenPage() {
	const children = await getChildren();

	return (
		<main className="space-y-6">
			<header className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(91,33,182,0.1)] backdrop-blur-xl">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-4">
						<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 shadow-sm">
							<UserRound size={27} aria-hidden="true" />
						</span>

						<div>
							<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
								Gestion des profils
							</p>

							<h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
								Mes enfants
							</h1>

							<p className="mt-1.5 max-w-2xl text-sm leading-5 text-slate-500">
								Gérez les profils, les protections et les paramètres de vos
								enfants.
							</p>
						</div>
					</div>

					<Link
						href="/parent-dashboard/children/new"
						className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 text-sm font-black text-white shadow-lg shadow-violet-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
					>
						<Plus size={18} aria-hidden="true" />
						Ajouter un enfant
					</Link>
				</div>
			</header>

			{children.length === 0 ? (
				<section className="rounded-[28px] border border-dashed border-violet-200 bg-white/85 px-6 py-12 text-center shadow-[0_16px_42px_rgba(30,41,59,0.08)] backdrop-blur-xl">
					<Image
						src="/mascottes/Robot-zen.png"
						alt="Robot ZouuSafe"
						width={120}
						height={120}
						className="mx-auto h-auto w-[120px]"
					/>

					<h2 className="mt-4 text-2xl font-black text-slate-900">
						Aucun enfant ajouté
					</h2>

					<p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
						Créez un premier profil enfant pour configurer sa protection,
						son filtre et sa limite de temps d’écran.
					</p>

					<Link
						href="/parent-dashboard/children/new"
						className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white transition hover:bg-violet-700"
					>
						<Plus size={18} aria-hidden="true" />
						Créer un profil
					</Link>
				</section>
			) : (
				<section className="grid gap-5 md:grid-cols-2">
					{children.map((child) => {
						const screenTimeLimit = child.screen_time_limit ?? 120;
						const screenTimeUsed = child.screen_time_used ?? 0;

						const progress =
							screenTimeLimit > 0
								? Math.min(
										100,
										Math.round(
											(screenTimeUsed / screenTimeLimit) * 100,
										),
									)
								: 0;

						const remainingTime = Math.max(
							screenTimeLimit - screenTimeUsed,
							0,
						);

						const avatarPath = getAvatarPath(child.avatar_url);

						return (
							<article
								key={child.child_id}
								className="group relative overflow-hidden rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-[0_16px_42px_rgba(30,41,59,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(91,33,182,0.13)]"
							>
								<div
									aria-hidden="true"
									className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-100/70 blur-3xl"
								/>

								<div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
									<Image
										src={avatarPath}
										alt={`Avatar de ${child.first_name}`}
										width={104}
										height={104}
										className="h-[104px] w-[104px] shrink-0 rounded-full border-4 border-white object-cover shadow-lg ring-2 ring-violet-200 transition-transform duration-300 group-hover:scale-[1.03]"
									/>

									<div className="min-w-0 flex-1">
										<div className="flex flex-wrap items-start justify-between gap-3">
											<div>
												<h2 className="truncate text-2xl font-black text-slate-950">
													{child.first_name}
												</h2>

												<p className="mt-1 text-sm font-semibold text-slate-500">
													Filtre :{" "}
													<span className="text-slate-700">
														{formatFilterLevel(child.filter_level)}
													</span>
												</p>
											</div>

											<span className="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
												Protection active
											</span>
										</div>

										<div className="mt-4 flex flex-wrap gap-2">
											<span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
												Profil enfant
											</span>

											<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
												{remainingTime} min restantes
											</span>
										</div>
									</div>
								</div>

								<section className="relative mt-5 rounded-[22px] border border-violet-100 bg-violet-50/60 p-4">
									<div className="flex items-end justify-between gap-4">
										<div>
											<h3 className="text-sm font-black text-slate-900">
												Temps d’écran aujourd’hui
											</h3>

											<p className="mt-1 text-xs text-slate-500">
												{screenTimeUsed} min utilisées sur{" "}
												{screenTimeLimit} min
											</p>
										</div>

										<strong className="text-2xl font-black text-violet-600">
											{progress} %
										</strong>
									</div>

									<div className="mt-4 h-3 overflow-hidden rounded-full bg-white shadow-inner">
										<div
											className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600 transition-all duration-500"
											style={{
												width: `${progress}%`,
											}}
										/>
									</div>
								</section>

								<div className="relative mt-5 grid gap-3 sm:grid-cols-2">
									<Link
										href={`/parent-dashboard/children/${child.child_id}`}
										className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white px-4 text-sm font-black text-violet-700 transition hover:bg-violet-50"
									>
										<Eye size={17} aria-hidden="true" />
										Voir le profil
									</Link>

									<Link
										href={`/parent-dashboard/children/${child.child_id}/edit`}
										className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 text-sm font-black text-white transition hover:bg-violet-700"
									>
										<Pencil size={17} aria-hidden="true" />
										Modifier
									</Link>
								</div>
							</article>
						);
					})}
				</section>
			)}
		</main>
	);
}