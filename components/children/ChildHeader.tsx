import { History, Settings, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
	return (
		<header className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-6 py-5">
			<Link href="/child-dashboard" className="shrink-0">
				<Image
					src="/logos/Renard-logo.png"
					alt="Logo ZouuSafe"
					width={220}
					height={90}
					priority
					className="h-auto w-[180px] md:w-[220px]"
				/>
			</Link>

			<nav className="flex items-center gap-3">
				<Link
					href={`/child-dashboard/favorites?childId=${childId}`}
					className="hidden items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex"
				>
					<Star size={18} className="text-yellow-500" />
					Favoris
				</Link>

				<Link
					href={`/child-dashboard/history?childId=${childId}`}
					className="hidden items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:flex"
				>
					<History size={18} className="text-violet-600" />
					Historique
				</Link>

				<Link
					href={`/child-dashboard/settings?childId=${childId}`}
					className="hidden items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:flex"
				>
					<Settings size={18} className="text-violet-600" />
					Paramètres
				</Link>

				<div className="flex items-center gap-2 rounded-full bg-white p-2 pr-4 shadow-sm">
					<Image
						src={avatarUrl}
						alt={`Avatar de ${childName}`}
						width={42}
						height={42}
						className="h-10 w-10 rounded-full object-cover"
					/>

					<span className="font-black">{childName}</span>
				</div>
			</nav>
		</header>
	);
}