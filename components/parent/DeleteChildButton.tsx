"use client";

import { Trash2, TriangleAlert, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteChildButtonProps = {
	childId: number;
	childName: string;
};

export default function DeleteChildButton({
	childId,
	childName,
}: DeleteChildButtonProps) {
	const router = useRouter();

	const [isOpen, setIsOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState("");

	async function handleDelete() {
		setError("");
		setIsDeleting(true);

		try {
			const response = await fetch(`/api/children/${childId}`, {
				method: "DELETE",
			});

			const data = (await response.json()) as {
				message?: string;
			};

			if (!response.ok) {
				throw new Error(
					data.message || "Impossible de supprimer ce profil.",
				);
			}

			setIsOpen(false);
			router.refresh();
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Une erreur est survenue.",
			);
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-red-100 px-3 text-sm font-bold text-red-600 transition hover:bg-red-200"
			>
				<Trash2 size={17} />
				Supprimer
			</button>

			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
					<section
						role="dialog"
						aria-modal="true"
						aria-labelledby="delete-child-title"
						className="relative w-full max-w-md rounded-[30px] border border-white/80 bg-white p-7 shadow-2xl"
					>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							disabled={isDeleting}
							aria-label="Fermer la fenêtre"
							className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
						>
							<X size={20} />
						</button>

						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
							<TriangleAlert size={30} />
						</div>

						<h2
							id="delete-child-title"
							className="mt-5 text-2xl font-black text-slate-900"
						>
							Supprimer {childName} ?
						</h2>

						<p className="mt-3 leading-7 text-slate-600">
							Le profil de {childName} sera supprimé définitivement avec
							ses paramètres associés.
						</p>

						<p className="mt-2 text-sm font-semibold text-red-600">
							Cette action est irréversible.
						</p>

						{error && (
							<p
								role="alert"
								className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
							>
								{error}
							</p>
						)}

						<div className="mt-7 grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								disabled={isDeleting}
								className="min-h-12 rounded-2xl border border-slate-200 bg-white font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
							>
								Annuler
							</button>

							<button
								type="button"
								onClick={handleDelete}
								disabled={isDeleting}
								className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<Trash2 size={18} />

								{isDeleting
									? "Suppression..."
									: "Supprimer"}
							</button>
						</div>
					</section>
				</div>
			)}
		</>
	);
}