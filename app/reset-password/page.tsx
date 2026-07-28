import Image from "next/image";
import Link from "next/link";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
			<Image
				src="/backgrounds/clouds-bg.png"
				alt=""
				fill
				priority
				className="-z-20 object-cover"
			/>

			<div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/10 via-pink-300/10 to-orange-200/10" />

			<Image
				src="/mascottes/Renard-telephone.png"
				alt="Renard ZouuSafe avec un téléphone"
				width={340}
				height={340}
				className="float absolute bottom-0 left-5 hidden h-auto w-[280px] drop-shadow-2xl xl:block"
			/>

			<Image
				src="/mascottes/Robot-protecteur.png"
				alt="Robot protecteur ZouuSafe"
				width={300}
				height={360}
				className="float absolute right-10 top-28 hidden h-auto w-[250px] drop-shadow-2xl xl:block"
			/>

			<p className="absolute right-64 top-36 hidden rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-violet-700 shadow-lg xl:block">
				🔐 Créons un nouveau mot de passe
			</p>

			<section className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">
				<Link href="/" aria-label="Retour à l’accueil">
					<Image
						src="/logos/Renard-logo.png"
						alt="Logo ZouuSafe"
						width={250}
						height={100}
						priority
						className="mx-auto mb-4 h-auto w-[210px]"
					/>
				</Link>

				<header className="text-center">
					<h1 className="text-3xl font-black text-slate-900">
						Nouveau mot de passe
					</h1>

					<p className="mt-3 text-sm leading-6 text-slate-600">
						Choisissez un mot de passe sécurisé pour protéger votre espace
						parent.
					</p>
				</header>

				<ResetPasswordForm />

				<p className="mt-7 text-center text-sm text-slate-600">
					Vous n’avez pas demandé cette modification ?{" "}
					<Link
						href="/login"
						className="font-bold text-violet-600 hover:underline"
					>
						Retour à la connexion
					</Link>
				</p>
			</section>

			<p className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-center text-sm font-semibold text-slate-700 md:block">
				🛡️ ZouuSafe protège votre famille à chaque étape.
			</p>
		</main>
	);
}
