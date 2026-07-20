import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
	return (
		<section
			id="home"
			className="relative min-h-[760px] overflow-hidden bg-gradient-to-br from-[#eef4ff] via-[#f8efff] to-[#fff3e7] pt-28"
		>
			<Image
				src="/backgrounds/clouds-bg.png"
				alt=""
				fill
				priority
				className="object-cover opacity-40"
			/>

			<Image
				src="/icones/bulle-recherche.png"
				alt=""
				width={82}
				height={82}
				className="float absolute left-[21%] top-36 hidden h-auto w-[70px] drop-shadow-lg xl:block"
			/>

			<Image
				src="/icones/bulle-etoile.png"
				alt=""
				width={82}
				height={82}
				className="float absolute right-[26%] top-40 hidden h-auto w-[70px] drop-shadow-lg xl:block"
			/>

			<Image
				src="/icones/bulle-protection.png"
				alt=""
				width={82}
				height={82}
				className="float absolute left-[5%] top-[55%] hidden h-auto w-[72px] drop-shadow-lg xl:block"
			/>

			<section className="relative z-10 mx-auto grid min-h-[650px] max-w-[1500px] items-center gap-8 px-6 pb-8 pt-16 lg:grid-cols-[0.8fr_1.35fr_0.8fr] lg:px-10">
				<div className="hidden justify-center lg:flex">
					<Image
						src="/enfants/Fille-tablette.png"
						alt="Petite fille utilisant une tablette"
						width={430}
						height={560}
						priority
						className="float h-auto w-full max-w-[350px] drop-shadow-2xl"
					/>
				</div>

				<section className="text-center">
					<p className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-5 py-2 text-sm font-bold text-violet-600 shadow-sm">
						<ShieldCheck size={17} />
						Le copilote numérique des familles
					</p>

					<h1 className="text-5xl font-black leading-[1.04] tracking-tight md:text-7xl">
						Internet sécurisé
						<br />
						<span className="bg-gradient-to-r from-fuchsia-500 via-orange-300 to-blue-500 bg-clip-text text-transparent">
							pour les enfants
						</span>
					</h1>

					<p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-700 md:text-lg">
						ZouuSafe est un moteur de recherche sécurisé avec contrôle parental,
						conçu pour que les enfants explorent, apprennent et grandissent en
						toute sérénité.
					</p>

					<section className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
						<Link
							href="/register"
							className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-4 font-bold text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
						>
							Créer mon compte
							<ArrowRight size={19} />
						</Link>

						<a
							href="#features"
							className="flex items-center justify-center gap-3 rounded-xl border-2 border-violet-300 bg-white/90 px-8 py-4 font-bold text-violet-700 shadow-lg transition hover:-translate-y-1 hover:bg-violet-50"
						>
							Découvrir ZouuSafe
						</a>
					</section>

					<section className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-violet-600">
						<span className="flex items-center gap-1.5">
							<ShieldCheck size={16} />
							Sans publicité
						</span>

						<span className="flex items-center gap-1.5">
							<Check size={16} />
							Filtres intelligents
						</span>

						<span className="flex items-center gap-1.5">
							<Check size={16} />
							100% sécurisé
						</span>
					</section>
				</section>

				<div className="hidden justify-center lg:flex">
					<Image
						src="/mascottes/Robot-protecteur.png"
						alt="Robot protecteur ZouuSafe"
						width={430}
						height={560}
						priority
						className="float h-auto w-full max-w-[350px] drop-shadow-2xl"
					/>
				</div>
			</section>
		</section>
	);
}
