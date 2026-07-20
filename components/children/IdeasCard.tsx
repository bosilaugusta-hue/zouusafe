const ideas = [
	"Le cycle de l’eau",
	"Les animaux marins",
	"Les inventions célèbres",
	"Les pyramides d’Égypte",
];

export default function IdeasCard() {
	return (
		<article className="rounded-3xl bg-white p-6 shadow-md">
			<h2 className="text-xl font-black text-violet-700">
				💡 Idées pour toi
			</h2>

			<ul className="mt-5 space-y-3">
				{ideas.map((idea) => (
					<li
						key={idea}
						className="rounded-2xl bg-violet-50 px-4 py-3 text-sm font-bold text-slate-700"
					>
						⭐ {idea}
					</li>
				))}
			</ul>
		</article>
	);
}