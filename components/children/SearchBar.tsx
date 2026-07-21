"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SearchBarProps = {
	childId: number;
};

export default function SearchBar({
	childId,
}: SearchBarProps) {
	const [query, setQuery] = useState("");
	const router = useRouter();

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const search = query.trim();

		if (!search) {
			return;
		}

		router.push(
			`/child-dashboard/search?childId=${childId}&query=${encodeURIComponent(search)}`
		);
	}

	return (
		<form onSubmit={handleSubmit} className="relative">
			<input
				type="search"
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				placeholder="Recherche sécurisée..."
				className="h-16 w-full rounded-full border border-white bg-white px-8 pr-20 text-lg shadow-xl outline-none transition focus:ring-4 focus:ring-violet-200"
			/>

			<button
				type="submit"
				className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700"
				aria-label="Lancer la recherche"
			>
				<Search size={24} />
			</button>
		</form>
	);
}