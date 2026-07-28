import Image from "next/image";

import { steps } from "@/data/homeData";

export default function StepsSection() {
	return (
		<section
			id="steps"
			className="relative overflow-hidden bg-gradient-to-r from-violet-50 via-pink-50 to-orange-50 px-8 py-32 md:px-12"
		>
			<div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />

			<div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />

			<div className="relative mx-auto grid max-w-[1750px] items-center gap-20 xl:grid-cols-[1.35fr_0.75fr]">
				<div>
					<header className="mb-16 text-center xl:text-left">
						<p className="zouu-eyebrow">Simple et rassurant</p>

						<h2 className="mt-4 text-5xl font-black leading-tight text-slate-900">
							Comment fonctionne ZouuSafe ?
						</h2>

						<p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-slate-600 xl:mx-0">
							En quelques étapes seulement, créez un environnement sécurisé pour
							votre enfant et accompagnez-le dans chacune de ses découvertes
							numériques.
						</p>
					</header>

					<div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
						<div className="absolute left-[9%] right-[9%] top-9 hidden h-[3px] rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-300 to-orange-300 lg:block" />

						{steps.map((step) => {
							const Icon = step.icon;

							return (
								<article
									key={step.number}
									className="zouu-card zouu-card-hover relative z-10 flex min-h-[360px] flex-col items-center rounded-[2rem] px-7 py-9 text-center"
								>
									<span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-2xl font-black text-white shadow-xl shadow-violet-300">
										{step.number}
									</span>

									<span className="mt-7 flex h-20 w-20 items-center justify-center rounded-[1.4rem] border border-violet-100 bg-violet-50 text-violet-600 shadow-md">
										<Icon size={34} strokeWidth={2} />
									</span>

									<h3 className="mt-7 text-xl font-black text-slate-900">
										{step.title}
									</h3>

									<p className="mt-5 text-[15px] leading-7 text-slate-600">
										{step.description}
									</p>
								</article>
							);
						})}
					</div>
				</div>

				<div className="flex items-end justify-center">
					<div className="relative">
						<div className="absolute inset-x-6 bottom-6 h-24 rounded-full bg-violet-300/30 blur-3xl" />

						<Image
							src="/enfants/kids.png"
							alt="Enfants explorateurs ZouuSafe"
							width={760}
							height={560}
							className="relative h-auto w-full max-w-[700px] object-contain drop-shadow-2xl"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
