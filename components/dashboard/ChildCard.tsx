import { Eye, Pencil } from "lucide-react";
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

	const monthDifference =
		today.getMonth() - birth.getMonth();

	if (
		monthDifference < 0 ||
		(monthDifference === 0 &&
			today.getDate() < birth.getDate())
	) {
		age -= 1;
	}

	return age;
}

export default function ChildCard({
	childList,
}: ChildCardProps) {
	return (
		<article className="rounded-3xl bg-white/95 p-6 shadow-xl">
			<header className="mb-5 flex items-center justify-between gap-4">
				<div>
					<h2 className="text-2xl font-black">
						Mes enfants
					</h2>

					<p className="mt-1 text-sm text-slate-500">
						Gérez les profils protégés de votre famille.
					</p>
				</div>

				<Link
					href="/parent-dashboard/children/new"
					className="rounded-full border border-violet-300 px-4 py-2 text-sm font-black text-violet-600 transition hover:bg-violet-50"
				>
					+ Ajouter
				</Link>
			</header>

			{childList.length === 0 ? (
				<section className="rounded-3xl border border-dashed border-violet-200 bg-violet-50/60 px-6 py-10 text-center">
					<Image
						src="/mascottes/Robot-zen.png"
						alt="Robot ZouuSafe"
						width={125}
						height={125}
						className="mx-auto h-auto"
					/>

					<h3 className="mt-4 text-xl font-black text-slate-900">
						Aucun enfant ajouté
					</h3>

					<p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
						Créez le premier profil enfant pour commencer à
						configurer sa protection, son temps d’écran et ses
						recherches.
					</p>

					<Link
						href="/parent-dashboard/children/new"
						className="mt-5 inline-flex rounded-2xl bg-gradient-to-r from-violet-400 to-violet-600 px-6 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5"
					>
						Créer un profil enfant
					</Link>
				</section>
			) : (
				<section className="grid gap-4 md:grid-cols-2">
					{childList.map((child) => {
						const age = calculateAge(child.birth_date);

						const avatar =
							child.avatar_url ??
							"/avatars-profil/fille-15.png";

						const avatarSrc = avatar.startsWith("/")
							? avatar
							: `/${avatar}`;

						return (
							<article
								key={child.child_id}
								className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-violet-50 p-5"
							>
								<div className="flex items-center gap-4">
									<Image
										src={avatarSrc}
										alt={`Avatar de ${child.first_name}`}
										width={100}
										height={100}
										className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
									/>

									<div>
										<h3 className="text-2xl font-black">
											{child.first_name}
										</h3>

										<p className="text-slate-600">
											{age} {age > 1 ? "ans" : "an"}
										</p>

										<span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-black text-green-700">
											Protection active
										</span>
									</div>
								</div>

								<div className="mt-5 grid grid-cols-3 gap-3">
									<Link
										href={`/parent-dashboard/children/${child.child_id}`}
										className="flex items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-bold shadow-sm transition hover:bg-violet-50"
									>
										<Eye size={18} />
										Voir
									</Link>

									<Link
										href={`/parent-dashboard/children/${child.child_id}/edit`}
										className="flex items-center justify-center gap-2 rounded-2xl bg-violet-100 py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-200"
									>
										<Pencil size={18} />
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
				</section>
			)}
		</article>
	);
}