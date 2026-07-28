import Image from "next/image";

import SecureSearchBar from "@/components/search/SecureSearchBar";

type SearchHeroProps = {
	childId: number;
	childName: string;
	standingAvatar: string;
};

export default function SearchHero({
	childId,
	childName,
	standingAvatar,
}: SearchHeroProps) {
	return (
		<section className="relative mx-auto min-h-[390px] w-full max-w-[1500px] overflow-hidden px-5 sm:px-8">
			<Image
				src={standingAvatar}
				alt={`Avatar de ${childName}`}
				width={390}
				height={520}
				priority
				className="absolute bottom-0 left-2 z-10 hidden h-[360px] w-auto object-contain lg:block xl:left-8 xl:h-[400px]"
			/>

			<Image
				src="/mascottes/robot-recherche.png"
				alt="Robot de recherche ZouuSafe"
				width={380}
				height={430}
				priority
				className="absolute bottom-0 right-2 z-10 hidden h-[330px] w-auto object-contain lg:block xl:right-8 xl:h-[370px]"
			/>

			<div className="relative z-20 mx-auto flex min-h-[390px] w-full max-w-[760px] flex-col items-center justify-center pb-10 pt-5 text-center">
				<h1 className="text-4xl font-black leading-tight text-violet-700 sm:text-5xl lg:text-6xl">
					Bonjour {childName} !
				</h1>

				<p className="mt-3 text-lg font-black text-slate-900 sm:text-xl">
					Que veux-tu découvrir aujourd&apos;hui ?
				</p>

				<div className="mt-6 w-full">
					<SecureSearchBar childId={childId} className="w-full" />
				</div>

				<div className="mt-5 flex flex-wrap items-center justify-center gap-3">
					<span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
						Safe Search activé
					</span>

					<span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
						Adapté aux enfants
					</span>

					<span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700">
						Découvre en toute sécurité
					</span>
				</div>
			</div>
		</section>
	);
}
