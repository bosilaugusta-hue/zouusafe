"use client";

import { History, LockKeyhole, Settings, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import ParentAccessModal from "./ParentAccessModal";

type ChildHeaderProps = {
	childId: number;
	childName: string;
	avatarUrl: string;
};

export default function ChildHeader({
	childId,
	childName,
	avatarUrl,
}: ChildHeaderProps) {
	const [isParentModalOpen, setIsParentModalOpen] = useState(false);

	return (
		<>
			<header className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-6 pb-3 pt-5 sm:px-8">
				<Link
					href={`/child-dashboard?childId=${childId}`}
					className="shrink-0 xl:ml-4"
					aria-label="Retour à l’accueil enfant"
				>
					<Image
						src="/logos/Renard-logo.png"
						alt="Logo ZouuSafe"
						width={260}
						height={100}
						priority
						className="h-auto w-[185px] sm:w-[220px] lg:w-[250px]"
					/>
				</Link>

				<nav
					aria-label="Navigation enfant"
					className="flex items-center gap-2 lg:gap-3"
				>
					<Link
						href={`/child-dashboard/favorites?childId=${childId}`}
						className="hidden items-center gap-2 rounded-full border border-white/80 bg-white/95 px-5 py-3 text-sm font-bold text-slate-800 shadow-lg backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-xl sm:flex"
					>
						<Star size={18} aria-hidden="true" className="text-yellow-500" />
						Favoris
					</Link>

					<Link
						href={`/child-dashboard/history?childId=${childId}`}
						className="hidden items-center gap-2 rounded-full border border-white/80 bg-white/95 px-5 py-3 text-sm font-bold text-slate-800 shadow-lg backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-xl md:flex"
					>
						<History size={18} aria-hidden="true" className="text-violet-600" />
						Historique
					</Link>

					<Link
						href={`/child-dashboard/settings?childId=${childId}`}
						className="hidden items-center gap-2 rounded-full border border-white/80 bg-white/95 px-5 py-3 text-sm font-bold text-slate-800 shadow-lg backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-xl lg:flex"
					>
						<Settings
							size={18}
							aria-hidden="true"
							className="text-violet-600"
						/>
						Paramètres
					</Link>

					<div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/95 p-2 shadow-lg backdrop-blur-sm">
						<Image
							src={avatarUrl}
							alt={`Avatar de ${childName}`}
							width={44}
							height={44}
							className="h-10 w-10 rounded-full object-cover sm:h-11 sm:w-11"
						/>

						<span className="hidden px-1 text-sm font-black text-slate-900 sm:inline">
							{childName}
						</span>

						<button
							type="button"
							onClick={() => setIsParentModalOpen(true)}
							className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-600 hover:shadow-md"
						>
							<LockKeyhole size={16} aria-hidden="true" />
							<span className="hidden sm:inline">Parent</span>
						</button>
					</div>
				</nav>
			</header>

			<ParentAccessModal
				isOpen={isParentModalOpen}
				onClose={() => setIsParentModalOpen(false)}
			/>
		</>
	);
}
