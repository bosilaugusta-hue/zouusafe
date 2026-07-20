"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
	return (
		<form className="relative">
			<input
				type="search"
				placeholder="Recherche sécurisée..."
				className="h-16 w-full rounded-full border border-white bg-white px-8 pr-20 text-lg shadow-xl outline-none transition focus:ring-4 focus:ring-violet-200"
			/>

			<button
				type="submit"
				className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700"
			>
				<Search size={24} />
			</button>
		</form>
	);
}