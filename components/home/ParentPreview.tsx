import { ArrowRight, Check, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const benefits = [
	"Historique des recherches",
	"Alertes de sécurité",
	"Limites de temps",
	"Gestion des appareils",
];

export default function ParentPreview() {
	return (
		<section id="about" className="bg-white px-5 py-20 md:px-10">
			<section className="mx-auto grid max-w-[1450px] items-center gap-12 lg:grid-cols-[0.7fr_1.3fr]">
				<article>
					<p className="font-bold text-violet-600">Espace parent</p>

					<h2 className="mt-3 text-4xl font-black leading-tight">
						Gardez un œil sur les découvertes de votre enfant
					</h2>

					<p className="mt-5 max-w-xl leading-7 text-slate-600">
						Consultez les recherches, les alertes, les appareils connectés et le
						temps d’écran depuis un tableau de bord simple et intuitif.
					</p>

					<ul className="mt-7 space-y-3 text-sm font-semibold text-slate-700">
						{benefits.map((benefit) => (
							<li key={benefit} className="flex items-center gap-2">
								<span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-violet-600">
									<Check size={13} />
								</span>

								{benefit}
							</li>
						))}
					</ul>

					<Link
						href="/login"
						className="mt-8 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-7 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
					>
						Découvrir l’espace parent
						<ArrowRight size={18} />
					</Link>
				</article>

				<article className="overflow-hidden rounded-[2rem] border border-violet-100 bg-white shadow-2xl">
					<section className="grid min-h-[430px] md:grid-cols-[165px_1fr]">
						<aside className="hidden bg-gradient-to-b from-violet-50 to-white p-5 md:block">
							<Image
								src="/logo_zouusafe.png"
								alt="Logo ZouuSafe"
								width={80}
								height={80}
								className="mx-auto mb-8 h-auto w-[58px]"
							/>

							<nav className="space-y-3 text-xs font-bold text-slate-600">
								<p className="rounded-xl bg-violet-100 px-3 py-3 text-violet-700">
									Accueil
								</p>

								<p className="px-3 py-2">Activité</p>

								<p className="flex items-center justify-between px-3 py-2">
									Alertes
									<span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] text-white">
										2
									</span>
								</p>

								<p className="px-3 py-2">Temps d’écran</p>
								<p className="px-3 py-2">Appareils</p>
								<p className="px-3 py-2">Paramètres</p>
							</nav>
						</aside>

						<section className="p-6 md:p-8">
							<header className="flex flex-wrap items-start justify-between gap-4">
								<section>
									<p className="text-sm text-slate-500">Tableau de bord</p>

									<h3 className="mt-1 text-2xl font-black">
										Bonjour, Parent <span className="wave">👋</span>
									</h3>

									<p className="mt-1 text-xs text-slate-500">
										Voici un résumé de l’activité de Zoé aujourd’hui.
									</p>
								</section>

								<select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
									<option>Zoé (9 ans)</option>
								</select>
							</header>

							<section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
								<StatCard label="Recherches" value="12" detail="Aujourd’hui" />
								<StatCard
									label="Temps d’écran"
									value="1h 25min"
									detail="Aujourd’hui"
								/>
								<StatCard
									label="Alertes"
									value="2"
									detail="Aujourd’hui"
									valueClassName="text-red-500"
								/>
								<StatCard label="Appareils" value="3" detail="Connectés" />
							</section>

							<section className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
								<article className="rounded-xl border border-slate-100 p-4">
									<h4 className="font-black">Activité récente</h4>

									<ActivityItem query="dinosaures" />
									<ActivityItem query="volcan" />
								</article>

								<article className="rounded-xl border border-slate-100 p-4">
									<h4 className="font-black">Limite de temps quotidienne</h4>

									<p className="mt-5 text-lg font-black">1h 30min / 2h</p>

									<div className="mt-3 h-2 overflow-hidden rounded-full bg-violet-100">
										<div className="h-full w-3/4 rounded-full bg-violet-500" />
									</div>

									<button
										type="button"
										className="mt-5 w-full rounded-lg border border-violet-200 py-2 text-xs font-bold text-violet-600"
									>
										Modifier la limite
									</button>
								</article>
							</section>
						</section>
					</section>
				</article>
			</section>
		</section>
	);
}

type StatCardProps = {
	label: string;
	value: string;
	detail: string;
	valueClassName?: string;
};

function StatCard({
	label,
	value,
	detail,
	valueClassName = "",
}: StatCardProps) {
	return (
		<article className="rounded-xl border border-slate-100 p-4">
			<p className="text-xs text-slate-500">{label}</p>

			<strong className={`mt-2 block text-2xl ${valueClassName}`}>
				{value}
			</strong>

			<span className="text-[11px] text-slate-400">{detail}</span>
		</article>
	);
}

function ActivityItem({ query }: { query: string }) {
	return (
		<section className="mt-4 flex items-center gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
			<span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
				<Search size={17} />
			</span>

			<section>
				<p className="text-xs font-semibold">Zoé a recherché : {query}</p>

				<p className="mt-1 text-[11px] text-green-600">Recherche autorisée</p>
			</section>
		</section>
	);
}
