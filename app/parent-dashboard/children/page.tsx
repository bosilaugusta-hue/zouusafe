import { Plus, UserRound } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import ChildCard from "@/components/dashboard/ChildCard";

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

export default async function ChildrenPage() {
	const children = await getChildren();

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-6 text-slate-900">
			<section className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
				<section className="space-y-6">
					<header className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-xl backdrop-blur-xl">
						<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
							<div className="flex items-center gap-4">
								<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
									<UserRound size={28} />
								</span>

								<div>
									<p className="text-sm font-black uppercase tracking-[0.15em] text-violet-500">
										Gestion des profils
									</p>

									<h1 className="mt-1 text-3xl font-black">Mes enfants</h1>

									<p className="mt-2 text-sm text-slate-500">
										Gérez les profils, les protections et les paramètres de vos
										enfants.
									</p>
								</div>
							</div>

							<Link
								href="/parent-dashboard/children/new"
								className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
							>
								<Plus size={20} />
								Ajouter un enfant
							</Link>
						</div>
					</header>

					<section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{children.map((child) => {
							const limit = child.screen_time_limit ?? 120;
							const used = child.screen_time_used ?? 0;

							const progress =
								limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

							const avatar = child.avatar_url ?? "/avatars-profil/fille-15.png";

							const avatarSrc = avatar.startsWith("/") ? avatar : `/${avatar}`;

							return (
								<article
									key={child.child_id}
									className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-xl backdrop-blur-xl"
								>
									<div className="flex items-center gap-4">
										<Image
											src={avatarSrc}
											alt={`Avatar de ${child.first_name}`}
											width={96}
											height={96}
											className="h-24 w-24 rounded-full border-4 border-violet-100 object-cover shadow-md"
										/>
										<div>
											<h2 className="text-2xl font-black">
												{child.first_name}
											</h2>

											<span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
												Protection active
											</span>

											<p className="mt-2 text-sm font-bold capitalize text-slate-500">
												Filtre : {child.filter_level ?? "standard"}
											</p>
										</div>
									</div>

									<div className="mt-6 rounded-2xl bg-violet-50 p-4">
										<div className="flex items-center justify-between gap-4">
											<div>
												<p className="text-sm font-black text-slate-800">
													Temps d’écran aujourd’hui
												</p>

												<p className="mt-1 text-xs text-slate-500">
													{used} min utilisées sur {limit} min
												</p>
											</div>

											<strong className="text-lg font-black text-violet-600">
												{progress} %
											</strong>
										</div>

										<div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
											<div
												className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600"
												style={{
													width: `${progress}%`,
												}}
											/>
										</div>
									</div>

									<div className="mt-5 grid grid-cols-2 gap-3">
										<Link
											href={`/parent-dashboard/children/${child.child_id}`}
											className="flex min-h-11 items-center justify-center rounded-2xl bg-violet-600 px-3 text-sm font-black text-white transition hover:bg-violet-700"
										>
											Voir le profil
										</Link>

										<Link
											href={`/parent-dashboard/children/${child.child_id}/edit`}
											className="flex min-h-11 items-center justify-center rounded-2xl bg-violet-100 px-3 text-sm font-black text-violet-700 transition hover:bg-violet-200"
										>
											Modifier
										</Link>
									</div>
								</article>
							);
						})}
					</section>

					{children.length === 0 && (
						<section className="rounded-[28px] border border-dashed border-violet-200 bg-white/80 p-10 text-center shadow-lg">
							<h2 className="text-2xl font-black">Aucun enfant ajouté</h2>

							<p className="mt-3 text-slate-500">
								Créez un premier profil pour commencer à configurer sa
								protection.
							</p>

							<Link
								href="/parent-dashboard/children/new"
								className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-violet-600 px-6 font-black text-white"
							>
								<Plus size={20} />
								Créer un profil
							</Link>
						</section>
					)}
				</section>
			</section>
		</main>
	);
}
