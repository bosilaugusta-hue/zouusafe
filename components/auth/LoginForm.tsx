"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

type LoginResponse = {
	message?: string;
	success?: boolean;
	parentId?: number;
	firstName?: string;
};

export default function LoginForm() {
	const router = useRouter();

	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setError("");
		setIsLoading(true);

		const formData = new FormData(event.currentTarget);

		const email = String(formData.get("email") ?? "")
			.trim()
			.toLowerCase();

		const password = String(formData.get("password") ?? "");

		try {
			const response = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});

			const result = (await response.json()) as LoginResponse;

			if (!response.ok) {
				setError(result.message ?? "Email ou mot de passe incorrect.");
				return;
			}

			router.push("/parent-dashboard");
			router.refresh();
		} catch (error) {
			console.error("Erreur de connexion :", error);

			setError("Impossible de contacter le serveur. Veuillez réessayer.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<form className="mt-8 space-y-5" onSubmit={handleSubmit}>
			<label className="block">
				<span className="mb-2 block text-sm font-bold text-slate-700">
					Adresse email
				</span>

				<span className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
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
						className="w-full bg-transparent py-3.5 outline-none"
					/>
				</span>
			</label>

			<label className="block">
				<span className="mb-2 block text-sm font-bold text-slate-700">
					Mot de passe
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
						autoComplete="current-password"
						placeholder="Votre mot de passe"
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
						aria-pressed={showPassword}
						onClick={() => setShowPassword((current) => !current)}
						className="shrink-0 text-slate-400 transition hover:text-violet-600"
					>
						{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
				</span>
			</label>

			<div className="flex items-center justify-between gap-4 text-sm">
				<label className="flex items-center gap-2 text-slate-600">
					<input
						type="checkbox"
						name="remember"
						className="h-4 w-4 accent-violet-500"
					/>
					Se souvenir de moi
				</label>

				<Link
					href="/forgot-password"
					className="font-semibold text-violet-600 hover:underline"
				>
					Mot de passe oublié ?
				</Link>
			</div>

			{error && (
				<p
					role="alert"
					className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
				>
					{error}
				</p>
			)}

			<button
				type="submit"
				disabled={isLoading}
				className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-violet-600 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
			>
				{isLoading ? "Connexion en cours..." : "Se connecter"}
			</button>
		</form>
	);
}
