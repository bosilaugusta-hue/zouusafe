import {
	BookOpen,
	CircleHelp,
	Clock3,
	Flag,
	Mail,
	MessageCircle,
	ShieldCheck,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";

const faqItems = [
	"Comment ajouter un enfant ?",
	"Comment modifier le temps d’écran ?",
	"Comment changer le code PIN parent ?",
	"Comment gérer les sites bloqués ?",
];

export default function SupportPage() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-6 text-slate-900">
			<section className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
				<Sidebar />

				<section className="space-y-6">
					<header className="rounded-[30px] border border-white/70 bg-white/90 p-7 shadow-xl backdrop-blur-xl">
						<div className="flex items-center gap-4">
							<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600 shadow-sm">
								<CircleHelp size={28} aria-hidden="true" />
							</span>

							<div>
								<p className="text-sm font-black uppercase tracking-[0.15em] text-violet-500">
									Nous sommes là pour vous
								</p>

								<h1 className="mt-1 text-3xl font-black">
									Aide & Support
								</h1>

								<p className="mt-2 text-sm text-slate-500">
									Trouvez rapidement une réponse ou contactez
									l’équipe ZouuSafe.
								</p>
							</div>
						</div>
					</header>

					<section className="grid gap-6 xl:grid-cols-2">
						<article className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-sm font-black uppercase tracking-[0.14em] text-blue-500">
										Centre d’aide
									</p>

									<h2 className="mt-1 text-2xl font-black">
										Questions fréquentes
									</h2>

									<p className="mt-2 text-sm leading-6 text-slate-500">
										Retrouvez les réponses aux questions les
										plus courantes.
									</p>
								</div>

								<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
									<CircleHelp size={23} aria-hidden="true" />
								</span>
							</div>

							<ul className="mt-6 space-y-3">
								{faqItems.map((item) => (
									<li
										key={item}
										className="flex items-center gap-3 rounded-2xl border border-blue-50 bg-blue-50/50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-sm"
									>
										<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm">
											<CircleHelp
												size={16}
												aria-hidden="true"
											/>
										</span>

										{item}
									</li>
								))}
							</ul>
						</article>

						<article className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-sm font-black uppercase tracking-[0.14em] text-violet-500">
										Contact
									</p>

									<h2 className="mt-1 text-2xl font-black">
										Contacter notre équipe
									</h2>

									<p className="mt-2 text-sm leading-6 text-slate-500">
										Expliquez-nous votre problème et notre
										équipe vous répondra rapidement.
									</p>
								</div>

								<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
									<MessageCircle size={23} aria-hidden="true" />
								</span>
							</div>

							<div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
								<div className="flex items-center gap-3">
									<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-violet-600 shadow-sm">
										<Mail size={19} aria-hidden="true" />
									</span>

									<div>
										<p className="text-sm font-bold text-slate-500">
											Adresse e-mail
										</p>

										<p className="font-black text-slate-900">
											support@zouusafe.fr
										</p>
									</div>
								</div>

								<button
									type="button"
									className="mt-5 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
								>
									Nous écrire
								</button>
							</div>
						</article>

						<article className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-500">
										Documentation
									</p>

									<h2 className="mt-1 text-2xl font-black">
										Guide des parents
									</h2>

									<p className="mt-2 text-sm leading-6 text-slate-500">
										Découvrez comment configurer et utiliser
										toutes les fonctions de ZouuSafe.
									</p>
								</div>

								<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
									<BookOpen size={23} aria-hidden="true" />
								</span>
							</div>

							<div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
								<div>
									<p className="font-black text-slate-900">
										Guide d’utilisation
									</p>

									<p className="mt-1 text-sm text-slate-500">
										Création des profils, sécurité et suivi.
									</p>
								</div>

								<button
									type="button"
									className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-black text-emerald-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
								>
									Consulter
								</button>
							</div>
						</article>

						<article className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-sm font-black uppercase tracking-[0.14em] text-rose-500">
										Signalement
									</p>

									<h2 className="mt-1 text-2xl font-black">
										Signaler un problème
									</h2>

									<p className="mt-2 text-sm leading-6 text-slate-500">
										Une recherche semble mal filtrée ou un
										contenu ne vous paraît pas adapté ?
									</p>
								</div>

								<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
									<Flag size={23} aria-hidden="true" />
								</span>
							</div>

							<div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/60 p-5">
								<div className="flex items-center gap-3">
									<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-rose-600 shadow-sm">
										<ShieldCheck size={19} aria-hidden="true" />
									</span>

									<p className="text-sm font-semibold leading-6 text-slate-600">
										Votre signalement nous aide à améliorer
										la sécurité des enfants.
									</p>
								</div>

								<button
									type="button"
									className="mt-5 w-full rounded-2xl bg-rose-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-xl"
								>
									Signaler une erreur
								</button>
							</div>
						</article>
					</section>

					<article className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
						<div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
							<div className="flex items-center gap-4">
								<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-600">
									<Clock3 size={26} aria-hidden="true" />
								</span>

								<div>
									<p className="text-sm font-black uppercase tracking-[0.14em] text-violet-500">
										Disponibilité
									</p>

									<h2 className="mt-1 text-2xl font-black">
										Notre équipe vous accompagne
									</h2>

									<p className="mt-2 text-sm text-slate-500">
										Support disponible du lundi au vendredi.
									</p>
								</div>
							</div>

							<div className="flex flex-wrap gap-3">
								<span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-black text-violet-700">
									8h00 – 18h00
								</span>

								<span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
									Réponse sous 24 h
								</span>
							</div>
						</div>
					</article>
				</section>
			</section>
		</main>
	);
}