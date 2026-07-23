import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import SecureSearchBar from "@/components/search/SecureSearchBar";

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

				<SecureSearchBar
					childId={childId}
					defaultQuery={query}
					className="flex-1"
				/>

				<Link
					href={`/child-dashboard?childId=${childId}`}
					className="flex shrink-0 items-center justify-center gap-2 rounded-full border border-violet-100 bg-white px-6 py-4 text-sm font-black text-slate-800 shadow-sm transition hover:bg-violet-50"
				>
					<ArrowLeft
						size={19}
						aria-hidden="true"
						className="text-violet-600"
					/>

					Retour à l&apos;accueil
				</Link>
			</div>
		</header>
	);
}