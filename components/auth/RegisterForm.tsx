"use client";

import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useState } from "react";

type RegisterResponse = {
	message?: string;
	success?: boolean;
};

export default function RegisterForm() {
	const router = useRouter();

	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setError("");
		setIsLoading(true);

		const formData = new FormData(event.currentTarget);

		const firstName = String(formData.get("firstName") ?? "").trim();
		const lastName = String(formData.get("lastName") ?? "").trim();
		const email = String(formData.get("email") ?? "")
			.trim()
			.toLowerCase();
		const password = String(formData.get("password") ?? "");
		const confirmPassword = String(
			formData.get("confirmPassword") ?? "",
		);

		if (password !== confirmPassword) {
			setError("Les deux mots de passe ne correspondent pas.");
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName,
					lastName,
					email,
					password,
					confirmPassword,
				}),
			});

			const result = (await response.json()) as RegisterResponse;

			if (!response.ok) {
				setError(
					result.message ??
						"Impossible de créer votre compte.",
				);
				return;
			}

			router.push("/login?registered=true");
			router.refresh();
		} catch (error) {
			console.error("Erreur lors de l’inscription :", error);

			setError(
				"Impossible de contacter le serveur. Veuillez réessayer.",
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<form className="space-y-5" onSubmit={handleSubmit}>
			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					label="Prénom"
					name="firstName"
					type="text"
					placeholder="Votre prénom"
					autoComplete="given-name"
					icon={<UserRound size={19} />}
				/>

				<FormField
					label="Nom"
					name="lastName"
					type="text"
					placeholder="Votre nom"
					autoComplete="family-name"
					icon={<UserRound size={19} />}
				/>
			</div>

			<FormField
				label="Adresse email"
				name="email"
				type="email"
				placeholder="exemple@email.com"
				autoComplete="email"
				icon={<Mail size={19} />}
			/>

			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					label="Mot de passe"
					name="password"
					type="password"
					placeholder="12 caractères minimum"
					autoComplete="new-password"
					minLength={12}
					icon={<LockKeyhole size={19} />}
				/>

				<FormField
					label="Confirmation"
					name="confirmPassword"
					type="password"
					placeholder="Confirmez le mot de passe"
					autoComplete="new-password"
					minLength={12}
					icon={<LockKeyhole size={19} />}
				/>
			</div>

			<label className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50/60 px-4 py-3 text-sm leading-6 text-slate-600">
				<input
					type="checkbox"
					name="terms"
					required
					className="mt-1 h-4 w-4 shrink-0 accent-violet-500"
				/>

				<span>
					J’accepte les conditions d’utilisation et la politique de
					confidentialité de ZouuSafe.
				</span>
			</label>

			{error && (
				<p
					role="alert"
					className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
				>
					{error}
				</p>
			)}

			<button
				type="submit"
				disabled={isLoading}
				className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-violet-600 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
			>
				{isLoading
					? "Création du compte..."
					: "Créer mon compte"}
			</button>
		</form>
	);
}

type FormFieldProps = {
	label: string;
	name: string;
	type: string;
	placeholder: string;
	autoComplete: string;
	icon: ReactNode;
	minLength?: number;
};

function FormField({
	label,
	name,
	type,
	placeholder,
	autoComplete,
	icon,
	minLength,
}: FormFieldProps) {
	return (
		<label className="block">
			<span className="mb-2 block text-sm font-bold text-slate-700">
				{label}
			</span>

			<span className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
				<span className="shrink-0 text-violet-500">
					{icon}
				</span>

				<input
					type={type}
					name={name}
					placeholder={placeholder}
					autoComplete={autoComplete}
					minLength={minLength}
					required
					className="w-full bg-transparent py-3 outline-none placeholder:text-slate-400"
				/>
			</span>
		</label>
	);
}