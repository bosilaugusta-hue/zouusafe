"use client";

import { LockKeyhole, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

type LoginResponse = {
	message?: string;
	success?: boolean;
	parentId?: number;
	firstName?: string;
};

export default function LoginPage() {
	const router = useRouter();

	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setError("");
		setIsLoading(true);

		const formData = new FormData(event.currentTarget);

		const credentials = {
			email: String(formData.get("email") ?? "").trim(),
			password: String(formData.get("password") ?? ""),
		};

		try {
			const response = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(credentials),
			});

			const result = (await response.json()) as LoginResponse;

			if (!response.ok) {
				setError(result.message ?? "La connexion a échoué.");
				return;
			}

			router.push("/parent-dashboard");
			router.refresh();
		} catch (requestError) {
			console.error("Erreur de connexion :", requestError);
			setError("Impossible de contacter le serveur.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
			<Image
				src="/clouds-bg.png"
				alt=""
				fill
				priority
				className="-z-20 object-cover"
			/>

			<div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/10 via-pink-300/10 to-orange-200/10" />

			<Image
				src="/Renard_ordinateur.png"
				alt="Renard ZouuSafe utilisant un ordinateur"
				width={390}
				height={390}
				className="float absolute bottom-0 left-4 hidden h-auto w-[310px] drop-shadow-2xl xl:block"
			/>

			<Image
				src="/Robot_protecteur.png"
				alt="Robot protecteur ZouuSafe"
				width={300}
				height={380}
				className="float absolute right-12 top-32 hidden h-auto w-[250px] drop-shadow-2xl xl:block"
			/>

			<p className="absolute right-64 top-36 hidden rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-violet-700 shadow-lg xl:block">
				👋 Bonjour Parent !
			</p>

			<section className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
				<Link href="/" aria-label="Retour à l’accueil">
					<Image
						src="/Renard_logo.png"
						alt="Logo ZouuSafe"
						width={260}
						height={100}
						priority
						className="mx-auto mb-4 h-auto w-[220px]"
					/>
				</Link>

				<header className="text-center">
					<h1 className="text-3xl font-black text-slate-900">
						Connexion parent
					</h1>

					<p className="mt-3 text-sm leading-6 text-slate-600">
						Retrouvez l’activité de votre enfant et ses paramètres de sécurité.
					</p>
				</header>

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
								disabled={isLoading}
								className="w-full bg-transparent py-3.5 outline-none disabled:cursor-not-allowed disabled:opacity-60"
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
								type="password"
								name="password"
								autoComplete="current-password"
								placeholder="Votre mot de passe"
								required
								disabled={isLoading}
								className="w-full bg-transparent py-3.5 outline-none disabled:cursor-not-allowed disabled:opacity-60"
							/>
						</span>
					</label>

					<section className="flex items-center justify-between gap-4 text-sm">
						<label className="flex items-center gap-2 text-slate-600">
							<input
								type="checkbox"
								name="remember"
								disabled={isLoading}
								className="h-4 w-4 accent-violet-500"
							/>
							Se souvenir de moi
						</label>

						<button
							type="button"
							className="font-semibold text-violet-600 hover:underline"
						>
							Mot de passe oublié ?
						</button>
					</section>

					{error && (
						<p
							role="alert"
							className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-700"
						>
							{error}
						</p>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full rounded-3xl bg-gradient-to-r from-violet-400 to-violet-600 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
					>
						{isLoading ? "Connexion en cours..." : "Se connecter"}
					</button>
				</form>

				<p className="mt-7 text-center text-sm text-slate-600">
					Pas encore de compte ?{" "}
					<Link
						href="/register"
						className="font-bold text-violet-600 hover:underline"
					>
						Créer un compte
					</Link>
				</p>
			</section>

			<p className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-center text-sm font-semibold text-slate-700 md:block">
				🛡️ ZouuSafe protège les explorations numériques de vos enfants.
			</p>
		</main>
	);
}
