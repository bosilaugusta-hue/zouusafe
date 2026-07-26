import Image from "next/image";
import { features } from "../../data/homeData";

export default function FeaturesSection() {
	return (
		<section
			id="features"
			className="relative z-10 -mt-8 rounded-t-[3.5rem] bg-white px-8 py-28 md:px-12"
		>
			<header className="mx-auto mb-20 max-w-5xl text-center">
				<p className="zouu-eyebrow">
					Les super-pouvoirs de Zouu
				</p>

				<h2 className="mt-4 text-5xl font-black leading-tight text-slate-900">
					Une protection pensée pour toute la famille
				</h2>

				<p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-slate-600">
					Les enfants découvrent Internet sereinement pendant que
					les parents gardent le contrôle grâce à des outils
					simples, intelligents et rassurants.
				</p>
			</header>

			<div className="mx-auto grid max-w-[1750px] gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
				{features.map((feature) => {
					const Icon = feature.icon;

					return (
						<article
							key={feature.title}
							className={`group flex min-h-[470px] flex-col rounded-[2.2rem] border p-7 text-center shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl ${feature.cardClass}`}
						>
							<div className="flex h-[230px] items-center justify-center">
								<Image
									src={feature.image}
									alt={feature.title}
									width={230}
									height={230}
									className="h-[210px] w-auto object-contain transition duration-500 group-hover:scale-110"
								/>
							</div>

							<h3
								className={`mt-5 text-xl font-black leading-snug ${feature.titleClass}`}
							>
								{feature.title}
							</h3>

							<p className="mt-5 flex-1 text-[15px] leading-7 text-slate-600">
								{feature.description}
							</p>

							<span
								className={`mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full shadow-md ${feature.iconClass}`}
							>
								<Icon size={24} />
							</span>
						</article>
					);
				})}
			</div>
		</section>
	);
}