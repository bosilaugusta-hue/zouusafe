"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

type ResetPasswordResponse = {
	message?: string;
};

export default function ResetPasswordForm() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setError("");
		setMessage("");

		if (!token) {
			setError("Le lien de réinitialisation est invalide ou incomplet.");
			return;
		}

		const formData = new FormData(event.currentTarget);

		const password = String(formData.get("password") ?? "");
		const confirmPassword = String(
			formData.get("confirmPassword") ?? "",
		);

		if (password.length < 12) {
			setError("Le mot de passe doit contenir au moins 12 caractères.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Les deux mots de passe ne correspondent pas.");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token,
					password,
					confirmPassword,
				}),
			});

			const result =
				(await response.json()) as ResetPasswordResponse;

			if (!response.ok) {
				setError(
					result.message ??
						"Impossible de modifier le mot de passe.",
				);
				return;
			}

			setMessage(
				result.message ??
					"Votre mot de passe a bien été modifié.",
			);

			event.currentTarget.reset();
		} catch (error) {
			console.error(
				"Erreur de réinitialisation du mot de passe :",
				error,
			);

			setError(
				"Impossible de contacter le serveur. Veuillez réessayer.",
			);
		} finally {
			setIsLoading(false);
		}
	}

	if (!token) {
		return (
			<section className="mt-8 text-center">
				<p className="rounded-2xl bg-red-50 px-4 py-4 text-sm font-semibold text-red-600">
					Le lien de réinitialisation est invalide ou incomplet.
				</p>

				<Link
					href="/forgot-password"
					className="mt-5 inline-block font-bold text-violet-600 hover:underline"
				>
					Demander un nouveau lien
				</Link>
			</section>
		);
	}

	return (
		<form className="mt-8 space-y-5" onSubmit={handleSubmit}>
			<label className="block">
				<span className="mb-2 block text-sm font-bold text-slate-700">
					Nouveau mot de passe
				</span>

				<span className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
					<LockKeyhole
						size={19}
						aria-hidden="true"
						className="shrink-0 text-violet-500"
					/>

					<input
						type={showPassword ? "text" : "password"}
						name="password"
						autoComplete="new-password"
						placeholder="12 caractères minimum"
						minLength={12}
						required
						className="w-full bg-transparent py-3.5 outline-none"
					/>

					<button
						type="button"
						aria-label={
							showPassword
								? "Masquer le mot de passe"
								: "Afficher le mot de passe"
						}
						onClick={() =>
							setShowPassword((current) => !current)
						}
						className="shrink-0 text-slate-400 transition hover:text-violet-600"
					>
						{showPassword ? (
							<EyeOff size={20} />
						) : (
							<Eye size={20} />
						)}
					</button>
				</span>
			</label>

			<label className="block">
				<span className="mb-2 block text-sm font-bold text-slate-700">
					Confirmer le mot de passe
				</span>

				<span className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
					<LockKeyhole
						size={19}
						aria-hidden="true"
						className="shrink-0 text-violet-500"
					/>

					<input
						type={showConfirmation ? "text" : "password"}
						name="confirmPassword"
						autoComplete="new-password"
						placeholder="Confirmez votre mot de passe"
						minLength={12}
						required
						className="w-full bg-transparent py-3.5 outline-none"
					/>

					<button
						type="button"
						aria-label={
							showConfirmation
								? "Masquer la confirmation"
								: "Afficher la confirmation"
						}
						onClick={() =>
							setShowConfirmation((current) => !current)
						}
						className="shrink-0 text-slate-400 transition hover:text-violet-600"
					>
						{showConfirmation ? (
							<EyeOff size={20} />
						) : (
							<Eye size={20} />
						)}
					</button>
				</span>
			</label>

			{error && (
				<p
					role="alert"
					className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
				>
					{error}
				</p>
			)}

			{message && (
				<section
					role="status"
					className="rounded-2xl bg-green-50 px-4 py-4 text-sm font-semibold text-green-700"
				>
					<p>{message}</p>

					<Link
						href="/login"
						className="mt-3 inline-block font-black text-violet-600 hover:underline"
					>
						Se connecter avec le nouveau mot de passe
					</Link>
				</section>
			)}

			<button
				type="submit"
				disabled={isLoading || Boolean(message)}
				className="w-full rounded-3xl bg-gradient-to-r from-violet-400 to-violet-600 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
			>
				{isLoading
					? "Modification en cours..."
					: "Enregistrer le nouveau mot de passe"}
			</button>
		</form>
	);
}