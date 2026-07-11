import Image from "next/image";
import { features } from "../../data/homeData";

export default function FeaturesSection() {
	return (
		<section
			id="features"
			className="relative z-10 rounded-t-[2.5rem] bg-white px-5 py-20 md:px-10"
		>
			<header className="mx-auto mb-12 max-w-3xl text-center">
				<p className="font-bold text-violet-600">Les super-pouvoirs de Zouu</p>

				<h2 className="mt-3 text-3xl font-black md:text-4xl">
					Une protection pensée pour toute la famille
				</h2>

				<p className="mt-4 text-slate-600">
					Les enfants découvrent internet sereinement pendant que les parents
					gardent le contrôle.
				</p>
			</header>

			<section className="mx-auto grid max-w-[1450px] gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				{features.map((feature) => {
					const Icon = feature.icon;

					return (
						<article
							key={feature.title}
							className={`flex min-h-[390px] flex-col rounded-[1.7rem] border p-4 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl ${feature.cardClass}`}
						>
							<div className="flex h-[170px] items-center justify-center">
								<Image
									src={feature.image}
									alt={feature.title}
									width={175}
									height={175}
									className="h-[155px] w-auto object-contain drop-shadow-lg"
								/>
							</div>

							<h3 className={`mt-3 text-base font-black ${feature.titleClass}`}>
								{feature.title}
							</h3>

							<p className="mt-3 flex-1 text-xs leading-5 text-slate-600">
								{feature.description}
							</p>

							<span
								className={`mx-auto mt-5 flex h-10 w-10 items-center justify-center rounded-full ${feature.iconClass}`}
							>
								<Icon size={20} />
							</span>
						</article>
					);
				})}
			</section>
		</section>
	);
}
