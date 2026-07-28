import Image from "next/image";

export default function SafetyCard() {
	return (
		<article className="rounded-3xl bg-violet-100 p-6 text-center shadow-md">
			<Image
				src="/logos/renard-protection.png"
				alt="Logo de protection ZouuSafe"
				width={90}
				height={90}
				className="mx-auto h-20 w-20 object-contain"
			/>

			<h2 className="mt-3 text-xl font-black text-slate-900">
				Tu es en sécurité
			</h2>

			<p className="mt-2 text-sm leading-6 text-slate-600">
				ZouuSafe protège tes recherches et t’aide à découvrir des contenus
				adaptés.
			</p>
		</article>
	);
}
