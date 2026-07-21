import { Lightbulb, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SearchSidebarProps = {
	childId: number;
	query: string;
};

const ageFilters = ["4-6 ans", "7-9 ans", "10-12 ans"];

const suggestions = [
	"Apprendre à dessiner",
	"Histoires de princesses",
	"Jeux éducatifs",
	"Coloriages à imprimer",
];

export default function SearchSidebar({
	childId,
	query,
}: SearchSidebarProps) {
	return (
		<aside className="space-y-5">
			<article className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
				<div className="flex items-start gap-4">
					<Image
						src="/logos/renard-protection.png"
						alt="Protection ZouuSafe"
						width={72}
						height={72}
						className="h-[72px] w-[72px] shrink-0 object-contain"
					/>

					<div>
						<div className="flex items-center gap-2 text-emerald-700">
							<ShieldCheck size={20} />

							<h2 className="text-lg font-black">
								Recherche protégée
							</h2>
						</div>

						<p className="mt-2 text-sm leading-6 text-slate-600">
							Les contenus proposés sont pensés pour les enfants et
							sélectionnés pour une navigation plus sûre.
						</p>
					</div>
				</div>
			</article>

			<article className="rounded-[28px] border border-white bg-white/90 p-6 shadow-sm">
				<h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
					<Sparkles size={20} className="text-violet-600" />
					Choisir un âge
				</h2>

				<div className="mt-4 flex flex-wrap gap-2">
					{ageFilters.map((age) => (
						<button
							key={age}
							type="button"
							className="rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-black text-violet-700 transition hover:bg-violet-100"
						>
							{age}
						</button>
					))}
				</div>
			</article>

			<article className="rounded-[28px] border border-white bg-white/90 p-6 shadow-sm">
				<h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
					<Lightbulb size={20} className="text-amber-500" />
					Tu peux aussi chercher
				</h2>

				<div className="mt-4 space-y-3">
					{suggestions.map((suggestion) => (
						<Link
							key={suggestion}
							href={`/child-dashboard/search?childId=${childId}&query=${encodeURIComponent(suggestion)}`}
							className="block rounded-2xl bg-violet-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-violet-100 hover:text-violet-700"
						>
							{suggestion}
						</Link>
					))}
				</div>

				<p className="mt-5 text-xs leading-5 text-slate-500">
					Recherche actuelle :{" "}
					<span className="font-black text-violet-700">
						{query}
					</span>
				</p>
			</article>
		</aside>
	);
}