import { Eye, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import DeleteChildButton from "@/components/parent/DeleteChildButton";

type Child = {
	child_id: number;
	first_name: string;
	birth_date: string;
	avatar_url: string | null;
};

type ChildCardProps = {
	childList: Child[];
};

function calculateAge(birthDate: string) {
	const birth = new Date(birthDate);
	const today = new Date();

	let age = today.getFullYear() - birth.getFullYear();
	const monthDifference = today.getMonth() - birth.getMonth();

	if (
		monthDifference < 0 ||
		(monthDifference === 0 && today.getDate() < birth.getDate())
	) {
		age -= 1;
	}

	return age;
}

function getAvatarPath(avatarUrl: string | null) {
	if (!avatarUrl) {
		return "/avatars-profil/fille-15.png";
	}

	return avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`;
}

export default function ChildCard({ childList }: ChildCardProps) {
	return (
		<section className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_16px_42px_rgba(30,41,59,0.08)] backdrop-blur-xl">
			<header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
						Profils
					</p>

					<h2 className="mt-1 text-xl font-black text-slate-900">
						Mes enfants
					</h2>

					<p className="mt-1.5 text-sm leading-5 text-slate-500">
						Consultez et gérez les profils enfants associés à votre compte.
					</p>
				</div>

				<Link
	href="/parent-dashboard/children"
	className="inline-flex items-center justify-center rounded-2xl bg-violet-50 px-4 py-2.5 text-sm font-black text-violet-700 transition hover:bg-violet-100"
>
	Voir tous
	<span aria-hidden="true" className="ml-1">
		→
	</span>
</Link>
			</header>

			{childList.length === 0 ? (
				<div className="rounded-[24px] border border-dashed border-violet-200 bg-violet-50/60 px-5 py-8 text-center">
					<Image
						src="/mascottes/Robot-zen.png"
						alt="Robot ZouuSafe"
						width={100}
						height={100}
						className="mx-auto h-auto w-[100px]"
					/>

					<h3 className="mt-3 text-lg font-black text-slate-900">
						Aucun profil enfant
					</h3>

					<p className="mx-auto mt-2 max-w-md text-sm leading-5 text-slate-600">
						Ajoutez un enfant pour configurer ses préférences de sécurité et
						suivre son activité.
					</p>

					<Link
						href="/parent-dashboard/children/new"
						className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-violet-700"
					>
						<Plus size={17} aria-hidden="true" />
						Créer un profil
					</Link>
				</div>
			) : (
				<>
					<div className="grid gap-4 md:grid-cols-2">
						{childList.map((child) => {
							const age = calculateAge(child.birth_date);
							const avatarPath = getAvatarPath(child.avatar_url);

							return (
								<article
									key={child.child_id}
									className="group relative overflow-hidden rounded-[26px] border border-violet-100 bg-white p-4 shadow-[0_10px_28px_rgba(30,41,59,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(91,33,182,0.12)]"
								>
									<div
										aria-hidden="true"
										className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-violet-100/65 blur-3xl"
									/>

									<div className="relative flex items-center gap-4">
										<div className="relative shrink-0">
											<div
												aria-hidden="true"
												className="absolute inset-2 rounded-full bg-violet-200/60 blur-xl"
											/>

											<Image
												src={avatarPath}
												alt={`Avatar de ${child.first_name}`}
												width={90}
												height={90}
												className="relative h-[90px] w-[90px] rounded-full border-4 border-white object-cover shadow-md transition-transform duration-300 group-hover:scale-[1.03]"
											/>
										</div>

										<div className="min-w-0">
											<h3 className="truncate text-xl font-black text-slate-900">
												{child.first_name}
											</h3>

											<p className="mt-1 text-sm font-semibold text-slate-500">
												{age} {age > 1 ? "ans" : "an"}
											</p>

											<span className="mt-2 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">
												Profil enfant
											</span>
										</div>
									</div>

									<div className="relative mt-4 grid gap-2 sm:grid-cols-3">
										<Link
											href={`/parent-dashboard/children/${child.child_id}`}
											className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 text-xs font-black text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
										>
											<Eye size={15} aria-hidden="true" />
											Voir
										</Link>

										<Link
											href={`/parent-dashboard/children/${child.child_id}/edit`}
											className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-violet-100 px-2 text-xs font-black text-violet-700 transition hover:bg-violet-200"
										>
											<Pencil size={15} aria-hidden="true" />
											Modifier
										</Link>

										<DeleteChildButton
											childId={child.child_id}
											childName={child.first_name}
										/>
									</div>
								</article>
							);
						})}
					</div>

					<div className="mt-5 flex justify-center">
						<Link
							href="/parent-dashboard/children/new"
							className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-black text-white shadow-md shadow-violet-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-700"
						>
							<Plus size={17} aria-hidden="true" />
							Ajouter un enfant
						</Link>
					</div>
				</>
			)}
		</section>
	);
}