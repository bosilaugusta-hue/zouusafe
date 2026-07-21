"use client";

import { Search, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SearchBarProps = {
	childId: number;
};

type SearchResponse = {
	allowed?: boolean;
	message?: string;
};

export default function SearchBar({ childId }: SearchBarProps) {
	const router = useRouter();

	const [search, setSearch] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const trimmedSearch = search.trim();

		if (!trimmedSearch || isLoading) {
			return;
		}

		setIsLoading(true);
		setErrorMessage("");

		try {
			const response = await fetch("/api/search", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					childId,
					query: trimmedSearch,
				}),
			});

			const data = (await response.json()) as SearchResponse;

			if (!response.ok) {
				throw new Error(
					data.message ?? "Impossible d’effectuer la recherche.",
				);
			}

			if (!data.allowed) {
				setErrorMessage(
					data.message ??
						"Cette recherche n’est pas adaptée aux enfants.",
				);

				return;
			}

			router.push(
				`/child-dashboard/search?childId=${childId}&query=${encodeURIComponent(
					trimmedSearch,
				)}&filter=all`,
			);
		} catch (error) {
			console.error(
				"Erreur pendant la recherche sécurisée :",
				error,
			);

			setErrorMessage(
				error instanceof Error
					? error.message
					: "Une erreur est survenue.",
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="w-full">
			<form
				onSubmit={handleSubmit}
				className="flex w-full items-center gap-3 rounded-[24px] border border-white/80 bg-white/85 p-2 shadow-[0_15px_40px_rgba(88,80,150,0.12)] backdrop-blur-xl"
			>
				<label htmlFor="child-search" className="sr-only">
					Rechercher un contenu
				</label>

				<div className="flex flex-1 items-center gap-3 px-4">
					<Search
						size={22}
						aria-hidden="true"
						className="shrink-0 text-violet-500"
					/>

					<input
						id="child-search"
						type="search"
						value={search}
						onChange={(event) => {
							setSearch(event.target.value);
							setErrorMessage("");
						}}
						placeholder="Que veux-tu découvrir aujourd'hui ?"
						autoComplete="off"
						className="min-w-0 flex-1 bg-transparent py-3 text-base font-semibold text-slate-800 outline-none placeholder:text-slate-400"
					/>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className="rounded-[18px] bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 font-black text-white shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isLoading ? "Vérification..." : "Rechercher"}
				</button>
			</form>

			{errorMessage ? (
				<div
					role="alert"
					className="mt-3 flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700"
				>
					<ShieldAlert
						size={20}
						aria-hidden="true"
						className="shrink-0"
					/>

					<p>{errorMessage}</p>
				</div>
			) : null}
		</div>
	);
}