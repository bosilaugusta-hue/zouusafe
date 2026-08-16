import { Lightbulb, Star } from "lucide-react";

const ideas = [
	"Le cycle de l’eau",
	"Les animaux marins",
	"Les inventions célèbres",
	"Les pyramides d’Égypte",
];

export default function IdeasCard() {
	return (
		<article className="h-full min-h-[330px] rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_14px_40px_rgba(30,41,59,0.10)] backdrop-blur-xl">
			<header className="flex items-center gap-2.5">
				<Lightbulb
					size={21}
					aria-hidden="true"
					className="text-amber-400"
				/>

				<h2 className="text-xl font-black text-violet-700">
					Idées pour toi
				</h2>
			</header>

			<ul className="mt-5 space-y-3">
				{ideas.map((idea) => (
					<li
						key={idea}
						className="flex items-center gap-3 rounded-2xl bg-violet-50/90 px-4 py-3 transition hover:bg-violet-100/80"
					>
						<Star
							size={16}
							aria-hidden="true"
							className="shrink-0 fill-amber-300 text-amber-300"
						/>

						<span className="text-sm font-bold text-slate-700">
							{idea}
						</span>
					</li>
				))}
			</ul>
		</article>
	);
}
