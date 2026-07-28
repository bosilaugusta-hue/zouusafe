import Image from "next/image";

export default function ChildFooter() {
	return (
		<footer className="bg-gradient-to-r from-violet-700 to-violet-500 px-6 py-5 text-white">
			<div className="mx-auto flex max-w-[1450px] items-center justify-between gap-4">
				<Image
					src="/logos/zouusafe-name.png"
					alt="ZouuSafe"
					width={160}
					height={50}
					className="h-auto w-[130px]"
				/>

				<p className="text-sm font-bold">
					Protection active • Contenu adapté • Sans publicité
				</p>

				<p className="text-sm font-bold">Besoin d'aide ?</p>
			</div>
		</footer>
	);
}
