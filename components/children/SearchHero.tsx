import Image from "next/image";
import SearchBar from "./SearchBar";

type SearchHeroProps = {
	childName: string;
	standingAvatar: string;
};

export default function SearchHero({
	childName,
	standingAvatar,
}: SearchHeroProps) {
	return (
		<section className="relative mx-auto flex min-h-[340px] w-full max-w-[1500px] items-center justify-center px-6">
			{/* Avatar enfant */}
			<Image
				src={standingAvatar}
				alt={childName}
				width={320}
				height={420}
				priority
				className="absolute bottom-0 left-4 hidden h-[380px] w-auto object-contain lg:block"
			/>

			{/* Robot recherche */}
			<Image
				src="/mascottes/robot-recherche.png"
				alt="Robot de recherche"
				width={240}
				height={240}
				className="absolute bottom-8 right-8 hidden h-[210px] w-auto object-contain xl:block"
			/>

			<div className="flex max-w-3xl flex-col items-center text-center">
				<h1 className="text-6xl font-black text-violet-700">
					Bonjour {childName} !
				</h1>

				<p className="mt-3 text-2xl font-semibold text-slate-800">
					Que veux-tu découvrir aujourd'hui ?
				</p>

				<div className="mt-8 w-full">
					<SearchBar />
				</div>

				<p className="mt-5 text-sm font-medium text-violet-600">
					🛡 Recherche sécurisée et adaptée aux enfants
				</p>
			</div>
		</section>
	);
}