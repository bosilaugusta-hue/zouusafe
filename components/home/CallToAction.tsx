import { ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CallToAction() {
	return (
		<section className="bg-white px-5 pb-20 pt-4 md:px-10">
			<div className="relative mx-auto max-w-[1450px]">
				<div className="absolute inset-x-12 bottom-0 h-20 rounded-full bg-violet-400/30 blur-3xl" />

				<div className="relative flex min-h-[190px] flex-col items-center justify-between gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-8 py-10 text-center text-white shadow-2xl shadow-violet-200 md:flex-row md:px-12 md:text-left">
					<div className="absolute -left-12 -top-20 h-56 w-56 rounded-full border border-white/20 bg-white/10" />

					<div className="absolute -bottom-24 right-40 h-64 w-64 rounded-full bg-pink-300/20 blur-2xl" />

					<Image
						src="/mascottes/renard-coucou.png"
						alt="Renard ZouuSafe qui fait coucou"
						width={190}
						height={190}
						priority
						className="relative z-20 h-auto w-[145px] select-none md:absolute md:-bottom-7 md:left-2 md:w-[190px]"
					/>

					<div className="relative z-10 md:pl-40">
						<p className="mb-3 flex items-center justify-center gap-2 text-sm font-bold text-violet-100 md:justify-start">
							<ShieldCheck size={17} />
							Une navigation plus sereine
						</p>

						<h2 className="text-2xl font-black leading-tight md:text-3xl">
							Prêt à offrir un internet sécurisé à vos enfants ?
						</h2>

						<p className="mt-3 max-w-2xl text-sm leading-6 text-violet-100">
							Créez votre espace parent et accompagnez vos enfants dans leurs
							découvertes numériques.
						</p>
					</div>

					<Link
						href="/register"
						className="relative z-10 flex min-h-[50px] shrink-0 items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 font-bold text-violet-700 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-violet-50 hover:shadow-2xl"
					>
						Créer mon compte
						<ArrowRight size={18} />
					</Link>
				</div>
			</div>
		</section>
	);
}