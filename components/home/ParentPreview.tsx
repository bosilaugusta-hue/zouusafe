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
		<section
			id="about"
			className="relative overflow-hidden bg-white px-8 py-32 md:px-12"
		>
			<div className="absolute -left-28 top-20 h-96 w-96 rounded-full bg-violet-100/70 blur-3xl" />

			<div className="absolute -right-28 bottom-10 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />

			<div className="relative mx-auto grid max-w-[1750px] items-center gap-20 lg:grid-cols-[0.7fr_1.3fr] xl:gap-24">
				<article>
					<p className="zouu-eyebrow">Espace parent</p>

					<h2 className="mt-4 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
						Gardez un œil sur les découvertes de votre enfant
					</h2>

					<p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl md:leading-9">
						Consultez les recherches, les alertes, les appareils connectés et le
						temps d’écran depuis un tableau de bord simple, rassurant et
						intuitif.
					</p>

					<ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
						{benefits.map((benefit) => (
							<li
								key={benefit}
								className="flex items-center gap-4 text-base font-bold text-slate-700"
							>
								<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 shadow-sm">
									<Check size={18} strokeWidth={3} />
								</span>

								{benefit}
							</li>
						))}
					</ul>

					<Link href="/login" className="btn-primary mt-11 px-10 py-5 text-lg">
						Découvrir l’espace parent
						<ArrowRight size={21} />
					</Link>
				</article>

				<article className="zouu-card relative overflow-hidden rounded-[2.7rem] p-4 md:p-6">
					<div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-200/40 blur-3xl" />

					<div className="overflow-hidden rounded-[2.3rem] border border-violet-100 bg-white shadow-2xl shadow-violet-100/70">
						<div className="grid min-h-[560px] md:grid-cols-[205px_1fr]">
							<aside className="hidden bg-gradient-to-b from-violet-50 via-white to-white p-7 md:block">
								<Image
									src="/logos/zouusafe-renard-tete.png"
									alt="Logo ZouuSafe"
									width={170}
									height={90}
									className="mx-auto mb-10 h-auto w-[150px]"
								/>

								<nav className="space-y-4 text-sm font-bold text-slate-600">
									<p className="rounded-2xl bg-violet-100 px-4 py-4 text-violet-700 shadow-sm">
										Accueil
									</p>

									<p className="px-4 py-3">Activité</p>

									<p className="flex items-center justify-between px-4 py-3">
										Alertes
										<span className="rounded-full bg-red-500 px-2.5 py-1 text-[11px] text-white">
											2
										</span>
									</p>

									<p className="px-4 py-3">Temps d’écran</p>
									<p className="px-4 py-3">Appareils</p>
									<p className="px-4 py-3">Paramètres</p>
								</nav>
							</aside>

							<section className="p-7 md:p-10">
								<header className="flex flex-wrap items-start justify-between gap-6">
									<div>
										<p className="text-base font-semibold text-slate-500">
											Tableau de bord
										</p>

										<h3 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
											Bonjour, Parent
										</h3>

										<p className="mt-2 text-sm leading-6 text-slate-500">
											Voici un résumé de l’activité de Zoé aujourd’hui.
										</p>
									</div>

									<select
										aria-label="Sélectionner un enfant"
										className="zouu-input min-h-0 w-auto px-4 py-3 text-sm"
									>
										<option>Zoé (9 ans)</option>
									</select>
								</header>

								<div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
									<StatCard
										label="Recherches"
										value="12"
										detail="Aujourd’hui"
									/>

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
								</div>

								<div className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
									<article className="rounded-[1.6rem] border border-slate-100 bg-slate-50/70 p-6">
										<h4 className="text-lg font-black text-slate-900">
											Activité récente
										</h4>

										<ActivityItem query="dinosaures" />
										<ActivityItem query="volcan" />
									</article>

									<article className="rounded-[1.6rem] border border-slate-100 bg-slate-50/70 p-6">
										<h4 className="text-lg font-black text-slate-900">
											Limite de temps quotidienne
										</h4>

										<p className="mt-7 text-2xl font-black text-slate-900">
											1h 30min / 2h
										</p>

										<div className="mt-4 h-3 overflow-hidden rounded-full bg-violet-100">
											<div className="h-full w-3/4 rounded-full bg-gradient-to-r from-violet-400 to-violet-600" />
										</div>

										<button
											type="button"
											className="btn-secondary mt-7 min-h-0 w-full px-4 py-3 text-sm"
										>
											Modifier la limite
										</button>
									</article>
								</div>
							</section>
						</div>
					</div>
				</article>
			</div>
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
		<article className="rounded-[1.4rem] border border-violet-100 bg-white p-6 shadow-sm">
			<p className="text-sm font-medium text-slate-500">{label}</p>

			<strong
				className={`mt-3 block text-3xl font-black text-slate-900 ${valueClassName}`}
			>
				{value}
			</strong>

			<span className="mt-1 block text-xs text-slate-400">{detail}</span>
		</article>
	);
}

function ActivityItem({ query }: { query: string }) {
	return (
		<div className="mt-5 flex items-center gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
			<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
				<Search size={20} />
			</span>

			<div>
				<p className="text-sm font-semibold text-slate-700">
					Zoé a recherché : {query}
				</p>

				<p className="mt-1 text-xs font-bold text-green-600">
					Recherche autorisée
				</p>
			</div>
		</div>
	);
}
