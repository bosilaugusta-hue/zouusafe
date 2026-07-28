"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

type SecureSearchBarProps = {
	childId: number;
	defaultQuery?: string;
	className?: string;
};

export default function SecureSearchBar({
	childId,
	defaultQuery = "",
	className = "",
}: SecureSearchBarProps) {
	const router = useRouter();

	const [query, setQuery] = useState(defaultQuery);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const cleanQuery = query.trim();

		if (!cleanQuery) {
			setError("Écris quelque chose à rechercher.");
			return;
		}

		setError("");
		setIsLoading(true);

		const params = new URLSearchParams({
			childId: String(childId),
			query: cleanQuery,
		});

		router.push(`/child-dashboard/search?${params.toString()}`);
	}

	return (
		<div className={`w-full ${className}`}>
			<form onSubmit={handleSubmit} className="relative w-full">
				<Search
					size={24}
					aria-hidden="true"
					className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-violet-600"
				/>

				<input
					type="search"
					value={query}
					onChange={(event) => {
						setQuery(event.target.value);

						if (error) {
							setError("");
						}
					}}
					placeholder="Que veux-tu découvrir ?"
					aria-label="Recherche sécurisée"
					className="h-16 w-full rounded-full border border-violet-100 bg-white pl-14 pr-20 text-base font-semibold text-slate-800 shadow-md outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-200 sm:text-lg"
				/>

				<button
					type="submit"
					disabled={isLoading}
					aria-label="Lancer la recherche"
					className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-violet-600 text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isLoading ? (
						<span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
					) : (
						<Search size={22} aria-hidden="true" />
					)}
				</button>
			</form>

			{error && (
				<p className="mt-2 pl-5 text-sm font-bold text-rose-600">{error}</p>
			)}
		</div>
	);
}
