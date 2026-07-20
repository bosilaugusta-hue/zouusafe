import { Search } from "lucide-react";
import Link from "next/link";

type SearchHistoryProps = {
	childId: number;
	childName: string;
};

export default function SearchHistory({
	childId,
	childName,
}: SearchHistoryProps) {
	return (
		<article className="rounded-3xl bg-white p-6 shadow-md">
			<header className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<Search size={22} className="text-violet-600" />

					<h2 className="text-xl font-black text-violet-700">
						Recherches récentes
					</h2>
				</div>

				<Link
					href={`/child-dashboard/history?childId=${childId}`}
					className="text-sm font-black text-violet-600 hover:underline"
				>
					Voir tout
				</Link>
			</header>

			<div className="flex min-h-32 items-center justify-center text-center">
				<p className="text-sm text-slate-500">
					Les recherches de {childName} apparaîtront ici.
				</p>
			</div>
		</article>
	);
}