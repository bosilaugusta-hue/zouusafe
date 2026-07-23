"use client";

import { KeyRound, ShieldCheck } from "lucide-react";
import { useState } from "react";

type PinResponse = {
	message?: string;
};

export default function ParentPinCard() {
	const [pin, setPin] = useState("");
	const [confirmPin, setConfirmPin] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	function handlePinChange(value: string) {
		setPin(value.replace(/\D/g, "").slice(0, 4));
		setMessage("");
		setError("");
	}

	function handleConfirmPinChange(value: string) {
		setConfirmPin(value.replace(/\D/g, "").slice(0, 4));
		setMessage("");
		setError("");
	}

	async function handleSubmit(
		event: React.FormEvent<HTMLFormElement>,
	) {
		event.preventDefault();

		if (pin.length !== 4) {
			setError("Le code PIN doit contenir exactement 4 chiffres.");
			return;
		}

		if (pin !== confirmPin) {
			setError("Les deux codes PIN ne correspondent pas.");
			return;
		}

		try {
			setIsLoading(true);
			setError("");
			setMessage("");

			const response = await fetch("/api/parent/pin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ pin }),
			});

			const data = (await response
	.json()
	.catch(() => ({}))) as PinResponse;

			if (!response.ok) {
				setError(
					data.message ??
						"Impossible d’enregistrer le code PIN.",
				);
				return;
			}

			setMessage(
				data.message ??
					"Le code PIN a bien été enregistré.",
			);

			setPin("");
			setConfirmPin("");
		} catch (error) {
			console.error(
				"Erreur pendant l’enregistrement du PIN :",
				error,
			);

			setError(
				"Une erreur est survenue. Réessaie dans quelques instants.",
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<section className="rounded-[28px] border border-violet-100 bg-white p-6 shadow-sm">
			<div className="flex items-start gap-4">
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
					<KeyRound className="h-6 w-6" />
				</div>

				<div>
					<h2 className="text-xl font-black text-slate-900">
						Code PIN parent
					</h2>

					<p className="mt-1 text-sm leading-6 text-slate-600">
						Ce code protège le retour vers le tableau de bord
						parent depuis l’espace enfant.
					</p>
				</div>
			</div>

			<form
				onSubmit={handleSubmit}
				className="mt-6 space-y-5"
			>
				<div>
					<label
						htmlFor="parent-pin"
						className="mb-2 block text-sm font-bold text-slate-700"
					>
						Nouveau code PIN
					</label>

					<input
						id="parent-pin"
						type="password"
						inputMode="numeric"
						autoComplete="new-password"
						maxLength={4}
						value={pin}
						onChange={(event) =>
							handlePinChange(event.target.value)
						}
						placeholder="••••"
						className="h-14 w-full rounded-2xl border border-violet-200 bg-violet-50 px-4 text-center text-2xl font-black tracking-[0.7em] text-violet-700 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
					/>
				</div>

				<div>
					<label
						htmlFor="confirm-parent-pin"
						className="mb-2 block text-sm font-bold text-slate-700"
					>
						Confirmer le code PIN
					</label>

					<input
						id="confirm-parent-pin"
						type="password"
						inputMode="numeric"
						autoComplete="new-password"
						maxLength={4}
						value={confirmPin}
						onChange={(event) =>
							handleConfirmPinChange(
								event.target.value,
							)
						}
						placeholder="••••"
						className="h-14 w-full rounded-2xl border border-violet-200 bg-violet-50 px-4 text-center text-2xl font-black tracking-[0.7em] text-violet-700 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
					/>
				</div>

				{error && (
					<p
						role="alert"
						className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600"
					>
						{error}
					</p>
				)}

				{message && (
					<p
						role="status"
						className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
					>
						<ShieldCheck className="h-5 w-5" />
						{message}
					</p>
				)}

				<button
					type="submit"
					disabled={
						isLoading ||
						pin.length !== 4 ||
						confirmPin.length !== 4
					}
					className="h-13 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-3 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
				>
					{isLoading
						? "Enregistrement..."
						: "Enregistrer le code PIN"}
				</button>
			</form>
		</section>
	);
}