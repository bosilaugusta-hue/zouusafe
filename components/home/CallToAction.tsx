import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CallToAction() {
	return (
		<section className="bg-white px-5 pb-16 md:px-10">
			<section className="relative mx-auto flex max-w-[1450px] flex-col items-center justify-between gap-6 overflow-visible rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-8 text-center text-white shadow-xl md:flex-row md:text-left">
				<Image
					src="/mascottes/renard-coucou.png"
					alt="Renard ZouuSafe qui fait coucou"
					width={170}
					height={170}
					priority
					className="absolute -bottom-6 -left-6 z-20 hidden h-auto w-[165px] select-none md:block"
				/>

				<div className="md:pl-32">
					<h2 className="text-2xl font-black md:text-3xl">
						Prêt à offrir un internet sécurisé à vos enfants ?
					</h2>

					<p className="mt-2 text-sm text-violet-100">
						Rejoignez les parents qui font déjà confiance à ZouuSafe.
					</p>
				</div>

				<Link
					href="/register"
					className="flex shrink-0 items-center gap-4 rounded-xl bg-white px-8 py-4 font-bold text-violet-700 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
				>
					Créer mon compte
					<ArrowRight size={18} />
				</Link>
			</section>
		</section>
	);
}