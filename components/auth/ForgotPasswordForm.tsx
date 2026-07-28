"use client";

import { CheckCircle2, Mail, ShieldAlert } from "lucide-react";
import { type FormEvent, useState } from "react";

type ForgotPasswordResponse = {
	message?: string;
};

export default function ForgotPasswordForm() {
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const form = event.currentTarget;

		setMessage("");
		setError("");
		setIsLoading(true);

		const formData = new FormData(form);

		const email = String(formData.get("email") ?? "")
			.trim()
			.toLowerCase();

		try {
			const response = await fetch("/api/forgot-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const result = (await response.json()) as ForgotPasswordResponse;

			if (!response.ok) {
				setError(
					result.message ??
						"Impossible de traiter votre demande pour le moment.",
				);
				return;
			}

			setMessage(
				result.message ??
					"Si un compte correspond à cette adresse, un lien de réinitialisation a été envoyé.",
			);

			form.reset();
		} catch (error) {
			console.error("Erreur lors de la demande de réinitialisation :", error);

			setError(
				"Impossible de contacter le serveur. Veuillez réessayer dans quelques instants.",
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<form className="space-y-5" onSubmit={handleSubmit}>
			<label className="block">
				<span className="mb-2 block text-sm font-bold text-slate-700">
					Adresse email
				</span>

				<span className="flex min-h-[54px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
					<Mail
						size={19}
						aria-hidden="true"
						className="shrink-0 text-violet-500"
					/>

					<input
						type="email"
						name="email"
						autoComplete="email"
						placeholder="exemple@email.com"
						required
						disabled={isLoading}
						className="w-full bg-transparent py-3.5 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
					/>
				</span>
			</label>

			<p className="rounded-2xl border border-violet-100 bg-violet-50/60 px-4 py-3 text-sm leading-6 text-slate-600">
				Le lien de réinitialisation sera envoyé uniquement à l’adresse associée
				à votre compte parent.
			</p>

			{error && (
				<div
					role="alert"
					className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
				>
					<ShieldAlert
						size={20}
						aria-hidden="true"
						className="mt-0.5 shrink-0"
					/>

					<p>{error}</p>
				</div>
			)}

			{message && (
				<div
					role="status"
					className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-4 text-green-700"
				>
					<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
						<CheckCircle2 size={22} aria-hidden="true" />
					</span>

					<div>
						<p className="font-black">Un email vient d’être envoyé</p>

						<p className="mt-1 text-sm leading-6">{message}</p>
					</div>
				</div>
			)}

			<button
				type="submit"
				disabled={isLoading}
				className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-violet-600 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
			>
				{isLoading
					? "Envoi du lien en cours..."
					: "Envoyer le lien de réinitialisation"}
			</button>
		</form>
	);
}
