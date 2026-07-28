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
							className="absolute left-0 top-1/2 z-20 flex h-12 w-12 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-full border border-violet-100 bg-white text-violet-600 shadow-lg transition hover:scale-105 hover:bg-violet-50 sm:-translate-x-5"
						>
							<ChevronLeft size={28} aria-hidden="true" />
						</button>
					)}

					<div className="grid grid-cols-2 gap-4 px-8 sm:grid-cols-4 sm:gap-5 sm:px-10 xl:grid-cols-8">
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
							className="absolute right-0 top-1/2 z-20 flex h-12 w-12 translate-x-2 -translate-y-1/2 items-center justify-center rounded-full border border-violet-100 bg-white text-violet-600 shadow-lg transition hover:scale-105 hover:bg-violet-50 sm:translate-x-5"
						>
							<ChevronRight size={28} aria-hidden="true" />
						</button>
					)}
				</div>

				{totalPages > 1 && (
					<div className="mt-6 flex items-center justify-center gap-4">
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
									className={`h-2.5 rounded-full transition-all ${
										page.pageNumber === currentPage
											? "w-7 bg-violet-600"
											: "w-2.5 bg-violet-200 hover:bg-violet-300"
									}`}
								/>
							))}
						</div>

						<span className="rounded-full border border-violet-100 bg-white px-4 py-1.5 text-sm font-black text-violet-700 shadow-sm">
							{currentPage + 1} / {totalPages}
						</span>
					</div>
				)}
			</div>
		</section>
	);
}
