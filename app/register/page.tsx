import { ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 md:px-10">
			<Image
				src="/backgrounds/clouds-bg.png"
				alt=""
				fill
				priority
				className="-z-30 object-cover"
			/>

			<div className="absolute inset-0 -z-20 bg-gradient-to-br from-violet-500/10 via-pink-300/10 to-orange-200/10" />

			<div className="absolute -left-28 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-violet-300/20 blur-3xl" />

			<div className="absolute -right-28 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-pink-300/20 blur-3xl" />

			{/* Renard de bienvenue */}
			<div className="absolute bottom-3 left-5 hidden h-[420px] w-[390px] xl:block 2xl:left-12">
				<Image
					src="/icones/bulle-recherche.png"
					alt=""
					width={70}
					height={70}
					className="float absolute left-[245px] top-[35px] z-20 h-auto w-[58px] drop-shadow-xl"
				/>

				<Image
					src="/mascottes/renard-bienvenue.png"
					alt="Renard ZouuSafe qui souhaite la bienvenue"
					width={340}
					height={390}
					priority
					className="float absolute bottom-0 left-0 z-10 h-auto w-[285px] drop-shadow-2xl 2xl:w-[310px]"
				/>

				<div className="absolute bottom-[34px] left-[195px] z-30 flex items-center gap-2 whitespace-nowrap rounded-2xl border border-white/80 bg-white/90 px-5 py-3 text-sm font-bold text-violet-700 shadow-xl backdrop-blur-xl">
					<Sparkles size={18} />
					Bienvenue chez ZouuSafe
				</div>
			</div>

			{/* Robot protecteur */}
			<div className="absolute right-5 top-14 hidden h-[430px] w-[400px] xl:block 2xl:right-12">
				<Image
					src="/icones/bulle-etoile.png"
					alt=""
					width={70}
					height={70}
					className="float absolute right-[15px] top-[25px] z-20 h-auto w-[58px] drop-shadow-xl"
				/>

				<Image
					src="/mascottes/Bonjour-robot.png"
					alt="Robot protecteur ZouuSafe"
					width={390}
					height={430}
					priority
					className="float absolute bottom-0 right-0 z-10 h-auto w-[315px] drop-shadow-2xl 2xl:w-[340px]"
				/>

				<div className="absolute left-[5px] top-[165px] z-30 flex items-center gap-2 whitespace-nowrap rounded-2xl border border-white/80 bg-white/90 px-5 py-3 text-sm font-bold text-violet-700 shadow-xl backdrop-blur-xl">
					<ShieldCheck size={18} />
					Compte sécurisé
				</div>
			</div>

			<section className="relative z-10 w-full max-w-[760px]">
				<div className="absolute -inset-3 rounded-[2.8rem] bg-gradient-to-br from-violet-300/35 via-white/25 to-pink-300/30 blur-md" />

				<div className="relative overflow-hidden rounded-[2.6rem] border border-white/90 bg-white/55 p-2 shadow-[0_35px_90px_rgba(91,33,182,0.22)] backdrop-blur-2xl">
					<div className="relative overflow-hidden rounded-[2.15rem] border border-violet-100/80 bg-gradient-to-b from-white via-white to-violet-50/55 px-8 py-7 sm:px-12">
						<div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-200/35 blur-3xl" />

						<div className="absolute -left-20 bottom-6 h-48 w-48 rounded-full bg-pink-200/20 blur-3xl" />

						<div className="relative mx-auto flex w-fit items-center gap-2 rounded-full border border-violet-100 bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-violet-600 shadow-sm">
							<ShieldCheck size={15} />
							Création de compte sécurisée
						</div>

						<Link
							href="/"
							aria-label="Retour à l’accueil"
							className="relative mt-2 block"
						>
							<div className="absolute left-1/2 top-1/2 h-20 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-200/30 blur-2xl" />

							<Image
								src="/logos/Renard-logo.png"
								alt="Logo ZouuSafe"
								width={250}
								height={100}
								priority
								className="relative mx-auto h-auto w-[205px]"
							/>
						</Link>

						<header className="relative mt-1 text-center">
							<p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600">
								Bienvenue sur ZouuSafe
							</p>

							<h1 className="mt-2 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
								Créer un compte parent
							</h1>

							<p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-600">
								Créez votre espace personnel et commencez à protéger les
								découvertes numériques de votre enfant.
							</p>
						</header>

						<div className="relative my-5 flex items-center gap-4">
							<div className="h-px flex-1 bg-gradient-to-r from-transparent to-violet-200" />

							<span className="h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_14px_rgba(139,92,246,0.75)]" />

							<div className="h-px flex-1 bg-gradient-to-l from-transparent to-violet-200" />
						</div>

						<div className="relative rounded-[1.6rem] border border-white bg-white/75 px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_15px_35px_rgba(124,58,237,0.08)] backdrop-blur-xl">
							<RegisterForm />
						</div>

						<div className="relative mt-5 flex flex-col items-center justify-between gap-4 border-t border-violet-100 pt-5 sm:flex-row">
							<p className="text-sm text-slate-600">
								Déjà inscrit ?{" "}
								<Link
									href="/login"
									className="font-bold text-violet-600 transition hover:text-violet-700 hover:underline"
								>
									Se connecter
								</Link>
							</p>

							<div className="flex items-center gap-2 rounded-2xl bg-violet-50/80 px-4 py-2.5 text-xs font-semibold text-slate-500">
								<ShieldCheck size={16} className="text-violet-500" />
								Données privées et protégées
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
