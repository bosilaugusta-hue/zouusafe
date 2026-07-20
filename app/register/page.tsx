import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
			<Image
				src="/backgrounds/clouds-bg.png"
				alt=""
				fill
				priority
				className="-z-20 object-cover"
			/>

			<div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/10 via-pink-300/10 to-orange-200/10" />

			<Image
				src="/enfants/kids.png"
				alt="Enfants explorateurs ZouuSafe"
				width={470}
				height={470}
				className="float absolute bottom-0 left-4 hidden h-auto w-[390px] drop-shadow-2xl xl:block"
			/>

			<Image
				src="/mascottes/Robot-protecteur.png"
				alt="Robot protecteur ZouuSafe"
				width={300}
				height={380}
				className="float absolute right-12 top-28 hidden h-auto w-[250px] drop-shadow-2xl xl:block"
			/>

			<p className="absolute right-64 top-36 hidden rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-violet-700 shadow-lg xl:block">
				👋 Bienvenue chez ZouuSafe !
			</p>

			<section className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
				<Link href="/" aria-label="Retour à l’accueil">
					<Image
						src="/logos/Renard-logo.png"
						alt="Logo ZouuSafe"
						width={260}
						height={100}
						priority
						className="mx-auto mb-3 h-auto w-[210px]"
					/>
				</Link>

				<header className="text-center">
					<h1 className="text-3xl font-black text-slate-900">
						Créer un compte parent
					</h1>

					<p className="mt-2 text-sm leading-6 text-slate-600">
						Commencez à protéger les découvertes numériques de votre enfant.
					</p>
				</header>

				<RegisterForm />

				<p className="mt-6 text-center text-sm text-slate-600">
					Déjà inscrit ?{" "}
					<Link
						href="/login"
						className="font-bold text-violet-600 hover:underline"
					>
						Se connecter
					</Link>
				</p>
			</section>

			<p className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-center text-sm font-semibold text-slate-700 md:block">
				🛡️ ZouuSafe protège les explorations numériques de vos enfants.
			</p>
		</main>
	);
}
