import { CircleHelp } from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";

export default function SupportPage() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-6 text-slate-900">
			<section className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
				<Sidebar />

				<section className="space-y-6">
					<header className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-xl">
						<div className="flex items-center gap-4">
							<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
								<CircleHelp size={28} />
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
				</section>
			</section>
		</main>
	);
}