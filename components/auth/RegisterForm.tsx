"use client";

import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export default function RegisterForm() {
	const router = useRouter();
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setError("");
		setIsLoading(true);

		const formData = new FormData(event.currentTarget);

		const parent = {
			firstName: formData.get("firstName"),
			lastName: formData.get("lastName"),
			email: formData.get("email"),
			password: formData.get("password"),
			confirmPassword: formData.get("confirmPassword"),
		};

		try {
			const response = await fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(parent),
			});

			const result = await response.json();

			if (!response.ok) {
				setError(result.message);
				return;
			}

			router.push("/login?registered=true");
		} catch {
			setError("Impossible de contacter le serveur.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<form className="mt-7 space-y-4" onSubmit={handleSubmit}>
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

			<FormField
				label="Adresse email"
				name="email"
				type="email"
				placeholder="exemple@email.com"
				autoComplete="email"
				icon={<Mail size={19} />}
			/>

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
				label="Confirmer le mot de passe"
				name="confirmPassword"
				type="password"
				placeholder="Confirmez votre mot de passe"
				autoComplete="new-password"
				minLength={12}
				icon={<LockKeyhole size={19} />}
			/>

			<label className="flex items-start gap-3 text-sm text-slate-600">
				<input
					type="checkbox"
					required
					className="mt-1 h-4 w-4 accent-violet-500"
				/>
				J’accepte les conditions d’utilisation et la politique de
				confidentialité.
			</label>

			{error && (
				<p
					role="alert"
					className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
				>
					{error}
				</p>
			)}

			<button
				type="submit"
				disabled={isLoading}
				className="w-full rounded-3xl bg-gradient-to-r from-violet-400 to-violet-600 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
			>
				{isLoading ? "Création en cours..." : "Créer mon compte"}
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
	icon: React.ReactNode;
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

			<span className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
				<span className="shrink-0 text-violet-500">{icon}</span>

				<input
					type={type}
					name={name}
					placeholder={placeholder}
					autoComplete={autoComplete}
					minLength={minLength}
					required
					className="w-full bg-transparent py-3 outline-none"
				/>
			</span>
		</label>
	);
}
