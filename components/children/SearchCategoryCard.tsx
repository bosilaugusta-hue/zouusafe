import Image from "next/image";
import Link from "next/link";

type SearchCategoryCardProps = {
	title: string;
	description: string;
	image: string;
	background: string;
	childId: number;
};

export default function SearchCategoryCard({
	title,
	description,
	image,
	background,
	childId,
}: SearchCategoryCardProps) {
	return (
		<Link
			href={`/child-dashboard/search?childId=${childId}&query=${encodeURIComponent(
				title,
			)}`}
			aria-label={`Découvrir la catégorie ${title}`}
			className={`group flex min-h-[205px] flex-col overflow-hidden rounded-[22px] border border-white/80 ${background} px-3 pb-4 pt-3 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
		>
			<h3 className="sr-only">{title}</h3>

			<div className="flex h-[125px] items-center justify-center">
				<Image
					src={image}
					alt={`Illustration de la catégorie ${title}`}
					width={170}
					height={150}
					className="h-[120px] w-full object-contain transition-transform duration-300 group-hover:scale-105"
				/>
			</div>

			<p className="mt-2 line-clamp-3 text-center text-xs font-medium leading-4 text-slate-600">
				{description}
			</p>
		</Link>
	);
}
