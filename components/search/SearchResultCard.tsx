import {
	BookOpen,
	ExternalLink,
	Gamepad2,
	Globe2,
	ImageIcon,
	Play,
	ShieldCheck,
} from "lucide-react";
import Image from "next/image";

type SearchCategory =
	| "all"
	| "images"
	| "videos"
	| "stories"
	| "games"
	| "coloring";

type SearchResultCardProps = {
	title: string;
	description: string;
	source: string;
	url: string;
	image: string | null;
	category: SearchCategory;
};

function getCategoryDetails(category: SearchCategory) {
	switch (category) {
		case "images":
			return {
				label: "Image",
				icon: ImageIcon,
				badgeClassName: "bg-blue-50 text-blue-700",
				buttonLabel: "Voir l’image",
			};

		case "videos":
			return {
				label: "Vidéo",
				icon: Play,
				badgeClassName: "bg-rose-50 text-rose-700",
				buttonLabel: "Regarder",
			};

		case "stories":
			return {
				label: "Histoire",
				icon: BookOpen,
				badgeClassName: "bg-amber-50 text-amber-700",
				buttonLabel: "Lire",
			};

		case "games":
			return {
				label: "Jeu",
				icon: Gamepad2,
				badgeClassName: "bg-emerald-50 text-emerald-700",
				buttonLabel: "Jouer",
			};

		case "coloring":
			return {
				label: "Coloriage",
				icon: ImageIcon,
				badgeClassName: "bg-fuchsia-50 text-fuchsia-700",
				buttonLabel: "Découvrir",
			};

		default:
			return {
				label: "Site",
				icon: Globe2,
				badgeClassName: "bg-violet-50 text-violet-700",
				buttonLabel: "Découvrir",
			};
	}
}

export default function SearchResultCard({
	title,
	description,
	source,
	url,
	image,
	category,
}: SearchResultCardProps) {
	const categoryDetails = getCategoryDetails(category);
	const CategoryIcon = categoryDetails.icon;

	const isGallery =
		category === "images" || category === "coloring";

	if (isGallery) {
		return (
			<article className="group overflow-hidden rounded-[28px] border border-white/90 bg-white/90 shadow-[0_12px_35px_rgba(88,80,150,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
				<div className="relative h-56 bg-violet-50">
					{image ? (
						<Image
							src={image}
							alt={title}
							fill
							unoptimized
							className="object-cover transition duration-300 group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full items-center justify-center">
							<ImageIcon
								size={52}
								aria-hidden="true"
								className="text-violet-300"
							/>
						</div>
					)}
				</div>

				<div className="p-5">
					<span
						className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${categoryDetails.badgeClassName}`}
					>
						<CategoryIcon
							size={16}
							aria-hidden="true"
						/>

						{categoryDetails.label}
					</span>

					<h2 className="mt-4 line-clamp-2 text-lg font-black text-slate-900">
						{title}
					</h2>

					<p className="mt-2 truncate text-sm font-bold text-violet-600">
						{source}
					</p>

					<a
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-5 flex items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-700"
					>
						{categoryDetails.buttonLabel}

						<ExternalLink
							size={17}
							aria-hidden="true"
						/>
					</a>
				</div>
			</article>
		);
	}

	return (
		<article className="overflow-hidden rounded-[28px] border border-white/90 bg-white/90 shadow-[0_12px_35px_rgba(88,80,150,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
			<div
				className={
					image
						? "grid md:grid-cols-[240px_minmax(0,1fr)]"
						: ""
				}
			>
				{image && (
					<div className="relative min-h-56 bg-violet-50">
						<Image
							src={image}
							alt={title}
							fill
							unoptimized
							className="object-cover"
						/>

						{category === "videos" && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/15">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-violet-700 shadow-lg">
									<Play
										size={28}
										aria-hidden="true"
										className="ml-1"
									/>
								</div>
							</div>
						)}
					</div>
				)}

				<div className="flex flex-col justify-between gap-5 p-6">
					<div>
						<div className="flex flex-wrap items-center gap-3">
							<span
								className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${categoryDetails.badgeClassName}`}
							>
								<CategoryIcon
									size={16}
									aria-hidden="true"
								/>

								{categoryDetails.label}
							</span>

							<span className="inline-flex items-center gap-2 text-xs font-black text-emerald-700">
								<ShieldCheck
									size={16}
									aria-hidden="true"
								/>

								Contenu protégé
							</span>
						</div>

						<h2 className="mt-4 text-xl font-black leading-snug text-slate-900 md:text-2xl">
							{title}
						</h2>

						<p className="mt-2 flex items-center gap-2 text-sm font-bold text-violet-600">
							<Globe2
								size={17}
								aria-hidden="true"
							/>

							{source}
						</p>

						<p className="mt-4 line-clamp-3 leading-7 text-slate-600">
							{description}
						</p>
					</div>

					<div className="flex justify-end">
						<a
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-700"
						>
							{categoryDetails.buttonLabel}

							<ExternalLink
								size={17}
								aria-hidden="true"
							/>
						</a>
					</div>
				</div>
			</div>
		</article>
	);
}