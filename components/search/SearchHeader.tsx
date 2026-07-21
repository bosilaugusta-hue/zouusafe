import { ArrowLeft, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SearchHeaderProps = {
	childId: number;
	query: string;
};

export default function SearchHeader({
	childId,
	query,
}: SearchHeaderProps) {
	return (
		<header className="border-b border-violet-100 bg-white/80 px-6 py-5 backdrop-blur-md">
			<div className="mx-auto flex max-w-[1450px] flex-col gap-5 lg:flex-row lg:items-center">
				<Link
	href={`/child-dashboard?childId=${childId}`}
	className="shrink-0"
>
	<Image
		src="/logos/pancarte-zouusafe-renard-tete.png"
		alt="Logo ZouuSafe"
		width={230}
		height={150}
		priority
		className="h-auto w-[170px] object-contain md:w-[200px]"
	/>
</Link>

				<form
					action="/child-dashboard/search"
					className="flex w-full items-center gap-3"
				>
					<input
						type="hidden"
						name="childId"
						value={childId}
					/>

					<div className="relative w-full">
						<Search
							size={24}
							className="absolute left-5 top-1/2 -translate-y-1/2 text-violet-600"
						/>

						<input
							type="search"
							name="query"
							defaultValue={query}
							placeholder="Que veux-tu découvrir ?"
							className="h-16 w-full rounded-full border border-violet-100 bg-white pl-14 pr-20 text-lg shadow-md outline-none transition focus:ring-4 focus:ring-violet-200"
						/>

						<button
							type="submit"
							className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700"
							aria-label="Lancer la recherche"
						>
							<Search size={22} />
						</button>
					</div>
				</form>

				<Link
					href={`/child-dashboard?childId=${childId}`}
					className="flex shrink-0 items-center justify-center gap-2 rounded-full border border-violet-100 bg-white px-6 py-4 text-sm font-black text-slate-800 shadow-sm transition hover:bg-violet-50"
				>
					<ArrowLeft size={19} className="text-violet-600" />
					Retour à l’accueil
				</Link>
			</div>
		</header>
	);
}