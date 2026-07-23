"use client";

import {
	Brain,
	LockKeyhole,
	RotateCcw,
	X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ParentAccessModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

type VerifyPinResponse = {
	valid?: boolean;
	message?: string;
	requiresPinSetup?: boolean;
};

type ModalStep = "calculation" | "pin";

function createCalculation() {
	const firstNumber = Math.floor(Math.random() * 8) + 2;
	const secondNumber = Math.floor(Math.random() * 8) + 2;

	return {
		firstNumber,
		secondNumber,
		result: firstNumber + secondNumber,
	};
}

export default function ParentAccessModal({
	isOpen,
	onClose,
}: ParentAccessModalProps) {
	const router = useRouter();

	const [step, setStep] =
		useState<ModalStep>("calculation");

	const [calculation, setCalculation] =
		useState(createCalculation);

	const [calculationAnswer, setCalculationAnswer] =
		useState("");

	const [pin, setPin] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setStep("calculation");
		setCalculation(createCalculation());
		setCalculationAnswer("");
		setPin("");
		setError("");
		setIsLoading(false);
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	function resetModal() {
		setStep("calculation");
		setCalculation(createCalculation());
		setCalculationAnswer("");
		setPin("");
		setError("");
	}

	function handleClose() {
		if (isLoading) {
			return;
		}

		resetModal();
		onClose();
	}

	function handleCalculationChange(value: string) {
		const numericValue = value
			.replace(/\D/g, "")
			.slice(0, 2);

		setCalculationAnswer(numericValue);
		setError("");
	}

	function handlePinChange(value: string) {
		const numericValue = value
			.replace(/\D/g, "")
			.slice(0, 4);

		setPin(numericValue);
		setError("");
	}

	function handleNewCalculation() {
		setCalculation(createCalculation());
		setCalculationAnswer("");
		setError("");
	}

	function handleCalculationSubmit(
		event: React.FormEvent<HTMLFormElement>,
	) {
		event.preventDefault();

		if (!calculationAnswer) {
			setError("Entre la réponse au calcul.");
			return;
		}

		if (
			Number(calculationAnswer) !==
			calculation.result
		) {
			setError(
				"Ce n’est pas la bonne réponse. Réessaie.",
			);
			return;
		}

		setStep("pin");
		setCalculationAnswer("");
		setError("");
	}

	function handleBackToCalculation() {
		setStep("calculation");
		setCalculation(createCalculation());
		setCalculationAnswer("");
		setPin("");
		setError("");
	}

	async function handlePinSubmit(
		event: React.FormEvent<HTMLFormElement>,
	) {
		event.preventDefault();

		if (pin.length !== 4) {
			setError(
				"Entre les 4 chiffres du code parent.",
			);
			return;
		}

		try {
			setIsLoading(true);
			setError("");

			const response = await fetch(
				"/api/parent/verify-pin",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ pin }),
				},
			);

			const data = (await response
				.json()
				.catch(() => ({}))) as VerifyPinResponse;

			if (!response.ok) {
				if (data.requiresPinSetup) {
					setError(
						"Le parent doit d’abord créer un code PIN depuis son tableau de bord.",
					);
					return;
				}

				setError(
					data.message ??
						"Impossible de vérifier le code PIN.",
				);
				return;
			}

			if (!data.valid) {
				setError("Le code PIN est incorrect.");
				return;
			}

			router.push("/parent-dashboard");
			router.refresh();
		} catch (error) {
			console.error(
				"Erreur pendant la vérification du PIN :",
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
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			aria-labelledby="parent-access-title"
		>
			<div className="relative w-full max-w-md rounded-[32px] border border-white/80 bg-white/95 p-7 shadow-2xl sm:p-9">
				<button
					type="button"
					onClick={handleClose}
					disabled={isLoading}
					className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
					aria-label="Fermer la fenêtre"
				>
					<X className="h-5 w-5" />
				</button>

				<div
					className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
						step === "calculation"
							? "bg-blue-100 text-blue-600"
							: "bg-violet-100 text-violet-600"
					}`}
				>
					{step === "calculation" ? (
						<Brain className="h-8 w-8" />
					) : (
						<LockKeyhole className="h-8 w-8" />
					)}
				</div>

				<div className="mt-5 text-center">
					<h2
						id="parent-access-title"
						className="text-2xl font-extrabold text-slate-900"
					>
						{step === "calculation"
							? "Vérification parent"
							: "Espace parent"}
					</h2>

					<p className="mt-2 text-sm leading-6 text-slate-600">
						{step === "calculation"
							? "Résous ce petit calcul pour continuer."
							: "Entre ton code parent pour quitter l’espace enfant."}
					</p>
				</div>

				{step === "calculation" ? (
					<form
						onSubmit={handleCalculationSubmit}
						className="mt-7"
					>
						<div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 text-center">
							<p className="text-sm font-bold text-blue-600">
								Combien font :
							</p>

							<p className="mt-3 text-4xl font-black text-slate-900">
								{calculation.firstNumber} +{" "}
								{calculation.secondNumber} ?
							</p>
						</div>

						<label
							htmlFor="parent-calculation"
							className="mt-5 block text-center text-sm font-bold text-slate-700"
						>
							Ta réponse
						</label>

						<input
							id="parent-calculation"
							type="text"
							inputMode="numeric"
							autoComplete="off"
							maxLength={2}
							value={calculationAnswer}
							onChange={(event) =>
								handleCalculationChange(
									event.target.value,
								)
							}
							className="mt-3 h-16 w-full rounded-2xl border-2 border-blue-200 bg-blue-50 px-4 text-center text-3xl font-black text-blue-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
							placeholder="?"
						/>

						{error && (
							<p
								className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-600"
								role="alert"
							>
								{error}
							</p>
						)}

						<button
							type="button"
							onClick={handleNewCalculation}
							className="mx-auto mt-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600"
						>
							<RotateCcw className="h-4 w-4" />
							Changer de calcul
						</button>

						<div className="mt-6 grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={handleClose}
								className="h-12 rounded-2xl border border-slate-200 bg-white font-bold text-slate-700 transition hover:bg-slate-50"
							>
								Annuler
							</button>

							<button
								type="submit"
								disabled={!calculationAnswer}
								className="h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
							>
								Continuer
							</button>
						</div>
					</form>
				) : (
					<form
						onSubmit={handlePinSubmit}
						className="mt-7"
					>
						<label
							htmlFor="parent-pin"
							className="block text-center text-sm font-bold text-slate-700"
						>
							Code PIN à 4 chiffres
						</label>

						<input
							id="parent-pin"
							type="password"
							inputMode="numeric"
							autoComplete="off"
							maxLength={4}
							value={pin}
							onChange={(event) =>
								handlePinChange(
									event.target.value,
								)
							}
							className="mt-3 h-16 w-full rounded-2xl border-2 border-violet-200 bg-violet-50 px-4 text-center text-3xl font-black tracking-[0.7em] text-violet-700 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
							placeholder="••••"
						/>

						{error && (
							<p
								className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-600"
								role="alert"
							>
								{error}
							</p>
						)}

						<button
							type="button"
							onClick={handleBackToCalculation}
							disabled={isLoading}
							className="mx-auto mt-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 transition hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<RotateCcw className="h-4 w-4" />
							Revenir au calcul
						</button>

						<div className="mt-6 grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={handleClose}
								disabled={isLoading}
								className="h-12 rounded-2xl border border-slate-200 bg-white font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Annuler
							</button>

							<button
								type="submit"
								disabled={
									isLoading ||
									pin.length !== 4
								}
								className="h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
							>
								{isLoading
									? "Vérification..."
									: "Valider"}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}