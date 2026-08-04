"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import SearchCategoryCard from "@/components/children/SearchCategoryCard";
import { searchCategories } from "@/data/childSearchData";

type SearchCategoriesProps = {
	childId: number;
};

const CATEGORIES_PER_PAGE = 8;

export default function SearchCategories({ childId }: SearchCategoriesProps) {
	const [currentPage, setCurrentPage] = useState(0);

	const totalPages = Math.ceil(searchCategories.length / CATEGORIES_PER_PAGE);

	const paginationPages = Array.from(
		{ length: totalPages },
		(_, pageNumber) => ({
			id: `categories-page-${pageNumber + 1}`,
			pageNumber,
		}),
	);

	const firstCategoryIndex = currentPage * CATEGORIES_PER_PAGE;

	const visibleCategories = searchCategories.slice(
		firstCategoryIndex,
		firstCategoryIndex + CATEGORIES_PER_PAGE,
	);

	function showPreviousPage() {
		setCurrentPage((previousPage) => {
			if (previousPage === 0) {
				return totalPages - 1;
			}

			return previousPage - 1;
		});
	}

	function showNextPage() {
		setCurrentPage((previousPage) => {
			if (previousPage === totalPages - 1) {
				return 0;
			}

			return previousPage + 1;
		});
	}

	return (
		<section className="bg-white/90 px-4 py-10 sm:px-6">
			<div className="mx-auto w-full max-w-[1450px]">
				<header className="flex items-center justify-center gap-4">
					<span className="hidden h-[2px] w-8 rounded-full bg-violet-500 sm:block" />

					<h2 className="text-center text-2xl font-black text-slate-900">
						Explore avec nos renards
					</h2>

					<span className="hidden h-[2px] w-8 rounded-full bg-violet-500 sm:block" />
				</header>

				<div className="relative mt-8">
					{totalPages > 1 && (
						<button
							type="button"
							onClick={showPreviousPage}
							aria-label="Afficher les catégories précédentes"
							className="absolute left-0 top-[46%] z-20 flex h-14 w-14 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-full border border-violet-200 bg-white text-violet-600 shadow-xl transition-all duration-300 hover:scale-110 hover:bg-violet-50 sm:-translate-x-5"
						>
							<ChevronLeft
								size={34}
								strokeWidth={2.5}
								aria-hidden="true"
							/>
						</button>
					)}

					<div className="grid grid-cols-2 gap-5 px-10 sm:grid-cols-4 sm:gap-6 sm:px-12 lg:grid-cols-6 xl:grid-cols-8">
						{visibleCategories.map((category) => (
							<SearchCategoryCard
								key={category.title}
								{...category}
								childId={childId}
							/>
						))}
					</div>

					{totalPages > 1 && (
						<button
							type="button"
							onClick={showNextPage}
							aria-label="Afficher les catégories suivantes"
							className="absolute right-0 top-[46%] z-20 flex h-14 w-14 translate-x-2 -translate-y-1/2 items-center justify-center rounded-full border border-violet-200 bg-white text-violet-600 shadow-xl transition-all duration-300 hover:scale-110 hover:bg-violet-50 sm:translate-x-5"
						>
							<ChevronRight
								size={34}
								strokeWidth={2.5}
								aria-hidden="true"
							/>
						</button>
					)}
				</div>

				{totalPages > 1 && (
					<div className="mt-8 flex items-center justify-center gap-6">
						<div className="flex items-center gap-2">
							{paginationPages.map((page) => (
								<button
									key={page.id}
									type="button"
									onClick={() => setCurrentPage(page.pageNumber)}
									aria-label={`Afficher la page ${page.pageNumber + 1}`}
									aria-current={
										page.pageNumber === currentPage ? "page" : undefined
									}
									className={`h-3 rounded-full transition-all duration-300 ${
										page.pageNumber === currentPage
											? "w-8 bg-violet-600"
											: "w-3 bg-violet-200 hover:bg-violet-300"
									}`}
								/>
							))}
						</div>

						<span className="rounded-full bg-white px-5 py-2 text-sm font-black text-violet-700 shadow-md">
							{currentPage + 1} / {totalPages}
						</span>
					</div>
				)}
			</div>
		</section>
	);
}