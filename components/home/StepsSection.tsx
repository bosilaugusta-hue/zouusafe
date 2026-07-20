import Image from "next/image";
import { steps } from "@/data/homeData";

export default function StepsSection() {
	return (
		<section
			id="steps"
			className="bg-gradient-to-r from-violet-50 via-pink-50 to-orange-50 px-5 py-16 md:px-10"
		>
			<section className="mx-auto grid max-w-[1450px] items-center gap-10 xl:grid-cols-[1.35fr_0.65fr]">
				<section>
					<header className="mb-10 text-center">
						<p className="font-bold text-violet-600">Simple et rassurant</p>

						<h2 className="mt-3 text-3xl font-black md:text-4xl">
							Comment fonctionne ZouuSafe ?
						</h2>
					</header>

					<section className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
						<div className="absolute left-[8%] right-[8%] top-7 hidden border-t-2 border-dashed border-violet-200 lg:block" />

						{steps.map((step) => {
							const Icon = step.icon;

							return (
								<article
									key={step.number}
									className="relative z-10 text-center"
								>
									<span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-xl font-black text-white shadow-lg">
										{step.number}
									</span>

									<span className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-violet-500 shadow-md">
										<Icon size={27} />
									</span>

									<h3 className="mt-5 font-black">{step.title}</h3>

									<p className="mx-auto mt-2 max-w-[190px] text-xs leading-5 text-slate-600">
										{step.description}
									</p>
								</article>
							);
						})}
					</section>
				</section>

				<div className="flex items-end justify-center">
					<Image
						src="/enfants/kids.png"
						alt="Enfants explorateurs ZouuSafe"
						width={620}
						height={430}
						className="h-auto w-full max-w-[540px] object-contain drop-shadow-xl"
					/>
				</div>
			</section>
		</section>
	);
}
