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
			href={`/child-dashboard/search?childId=${childId}&query=${encodeURIComponent(title)}`}
			className={`group overflow-hidden rounded-[1.75rem] border border-white p-4 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl ${background}`}
		>
			<Image
				src={image}
				alt={`Mascotte ${title}`}
				width={180}
				height={180}
				className="mx-auto h-32 w-full object-contain transition group-hover:scale-105"
			/>

			<h2 className="mt-2 text-lg font-black text-slate-900">
				{title}
			</h2>

			<p className="mt-1 text-sm leading-5 text-slate-600">
				{description}
			</p>
		</Link>
	);
}