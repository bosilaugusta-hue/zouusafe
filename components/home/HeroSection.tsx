import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
	return (
		<section
			id="home"
			className="relative min-h-[720px] overflow-hidden bg-gradient-to-br from-[#eef4ff] via-[#f8efff] to-[#fff3e7] pt-24"
		>
			<Image
				src="/backgrounds/clouds-bg.png"
				alt=""
				fill
				priority
				className="object-cover opacity-45"
			/>

			<div className="relative z-10 mx-auto min-h-[620px] max-w-[1750px] px-6 pb-12 pt-10 lg:px-10">
				<div className="grid min-h-[570px] items-center gap-2 lg:grid-cols-[1fr_1.45fr_1fr]">
					<div className="relative hidden h-full items-end justify-center lg:flex">
						<Image
							src="/icones/bulle-recherche.png"
							alt=""
							width={72}
							height={72}
							className="float absolute left-[64%] top-[3%] z-20 h-auto w-[62px] drop-shadow-lg xl:left-[67%] xl:top-[2%] xl:w-[68px]"
						/>

						<Image
							src="/icones/bulle-protection.png"
							alt=""
							width={72}
							height={72}
							className="float absolute left-[4%] top-[48%] z-20 h-auto w-[62px] drop-shadow-lg xl:left-[7%] xl:top-[46%] xl:w-[68px]"
						/>

						<Image
							src="/enfants/Fille-tablette.png"
							alt="Petite fille utilisant une tablette"
							width={500}
							height={620}
							priority
							className="float relative z-10 h-auto w-full max-w-[410px] drop-shadow-2xl"
						/>
					</div>

					<section className="relative z-20 mx-auto w-full max-w-[760px] text-center">
						<p className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-5 py-2 text-sm font-bold text-violet-600 shadow-sm">
							<ShieldCheck size={17} />
							Le copilote numérique des familles
						</p>

						<h1 className="text-5xl font-black leading-[0.98] tracking-tight text-slate-950 md:text-6xl xl:text-[68px]">
							<span className="whitespace-nowrap">
								Internet sécurisé
							</span>

							<br />

							<span className="whitespace-nowrap bg-gradient-to-r from-fuchsia-500 via-orange-300 to-blue-500 bg-clip-text text-transparent">
								pour les enfants
							</span>
						</h1>

						<p className="mx-auto mt-6 max-w-[680px] text-base leading-7 text-slate-600 md:text-lg">
							ZouuSafe est un moteur de recherche sécurisé avec contrôle
							parental, conçu pour que les enfants explorent, apprennent et
							grandissent en toute sérénité.
						</p>

						<div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
							<Link
								href="/register"
								className="btn-primary px-8 py-4 text-base"
							>
								Créer mon compte
								<ArrowRight size={19} />
							</Link>

							<a
								href="#features"
								className="btn-secondary px-8 py-4 text-base"
							>
								Découvrir ZouuSafe
							</a>
						</div>

						<div className="mt-7 flex flex-wrap justify-center gap-3 text-sm font-semibold">
							<span className="badge-success flex items-center gap-2 px-4 py-2">
								<ShieldCheck size={16} />
								Sans publicité
							</span>

							<span className="badge-violet flex items-center gap-2 px-4 py-2">
								<Check size={16} />
								Filtres intelligents
							</span>

							<span className="badge-violet flex items-center gap-2 px-4 py-2">
								<Check size={16} />
								100% sécurisé
							</span>
						</div>
					</section>

					<div className="relative hidden h-full items-end justify-center lg:flex">
						<Image
							src="/icones/bulle-etoile.png"
							alt=""
							width={72}
							height={72}
							className="float absolute left-[10%] top-[8%] z-20 h-auto w-[62px] drop-shadow-lg xl:left-[7%] xl:top-[7%] xl:w-[68px]"
						/>

						<Image
							src="/mascottes/Robot-protecteur.png"
							alt="Robot protecteur ZouuSafe"
							width={500}
							height={620}
							priority
							className="float relative z-10 h-auto w-full max-w-[410px] drop-shadow-2xl"
						/>
					</div>
				</div>
			</div>

			<div className="absolute inset-x-0 bottom-0 z-20 h-16 rounded-t-[3rem] bg-white" />
		</section>
	);
}