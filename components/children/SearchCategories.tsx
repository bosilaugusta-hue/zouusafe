import SearchCategoryCard from "./SearchCategoryCard";
import { searchCategories } from "@/data/childSearchData";

type SearchCategoriesProps = {
	childId: number;
};

export default function SearchCategories({
	childId,
}: SearchCategoriesProps) {
	return (
		<section className="bg-white/85 px-6 py-10 backdrop-blur-sm">
			<div className="mx-auto max-w-[1450px]">
				<h2 className="text-center text-2xl font-black text-slate-900">
					<span className="mr-4 text-violet-400">—</span>
					Explore avec nos renards
					<span className="ml-4 text-violet-400">—</span>
				</h2>

				<div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
					{searchCategories.map((category) => (
						<SearchCategoryCard
							key={category.title}
							{...category}
							childId={childId}
						/>
					))}
				</div>
			</div>
		</section>
	);
}