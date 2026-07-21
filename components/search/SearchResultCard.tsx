import {
	BookOpen,
	Clock3,
	ExternalLink,
	ShieldCheck,
	Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SearchResultCardProps = {
	title: string;
	description: string;
	image: string;
	source: string;
	category: string;
	age: string;
	duration: string;
	level: string;
	url: string;
};

export default function SearchResultCard({
	title,
	description,
	image,
	source,
	category,
	age,
	duration,
	level,
	url,
}: SearchResultCardProps) {
	return (
		<article className="overflow-hidden rounded-[28px] border border-white bg-white/90 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
			<div className="grid md:grid-cols-[230px_1fr]">
				<div className="relative min-h-[220px] bg-violet-50">
					<Image
						src={image}
						alt={title}
						fill
						className="object-cover"
					/>
				</div>

				<div className="flex flex-col justify-between gap-6 p-6">
					<div>
						<div className="flex flex-wrap items-center gap-3">
							<span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">
								{category}
							</span>

							<span className="flex items-center gap-1 text-sm font-bold text-emerald-600">
								<ShieldCheck size={17} />
								Contenu vérifié
							</span>
						</div>

						<h2 className="mt-4 text-2xl font-black text-slate-900">
							{title}
						</h2>

						<p className="mt-2 text-sm font-bold text-violet-600">
							{source}
						</p>

						<p className="mt-4 max-w-3xl leading-7 text-slate-600">
							{description}
						</p>

						<div className="mt-5 flex flex-wrap gap-3">
							<span className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">
								<BookOpen size={16} />
								{age}
							</span>

							<span className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-black text-amber-700">
								<Clock3 size={16} />
								{duration}
							</span>

							<span className="rounded-full bg-rose-50 px-3 py-2 text-xs font-black text-rose-700">
								{level}
							</span>
						</div>
					</div>

					<div className="flex flex-wrap items-center justify-between gap-4">
						<button
							type="button"
							className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-700 transition hover:bg-amber-100"
							aria-label={`Ajouter ${title} aux favoris`}
						>
							<Star size={18} />
							Favori
						</button>

						<Link
							href={url}
							className="flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-700"
						>
							Découvrir
							<ExternalLink size={17} />
						</Link>
					</div>
				</div>
			</div>
		</article>
	);
}