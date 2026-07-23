import { Settings } from "lucide-react";
import { cookies } from "next/headers";

import Sidebar from "@/components/dashboard/Sidebar";
import ParentPinCard from "@/components/parent/ParentPinCard";
import SettingsForm, {
	type Setting,
} from "@/components/settings/SettingsForm";

type SettingsResponse = {
	settings: Setting[];
};

async function getSettings(): Promise<Setting[]> {
	const cookieStore = await cookies();
	const sessionCookie =
		cookieStore.get("zouusafe_session");

	if (!sessionCookie) {
		throw new Error("Session utilisateur introuvable.");
	}

	const response = await fetch(
		"http://localhost:3000/api/settings",
		{
			cache: "no-store",
			headers: {
				Cookie: `zouusafe_session=${sessionCookie.value}`,
			},
		},
	);

	if (!response.ok) {
		throw new Error(
			"Impossible de récupérer les paramètres.",
		);
	}

	const data =
		(await response.json()) as SettingsResponse;

	return data.settings;
}

export default async function SettingsPage() {
	const settings = await getSettings();

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-6 text-slate-900">
			<section className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
				<Sidebar />

				<section className="space-y-6">
					<header className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-xl backdrop-blur-xl">
						<div className="flex items-center gap-4">
							<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
								<Settings size={28} />
							</span>

							<div>
								<p className="text-sm font-black uppercase tracking-[0.15em] text-violet-500">
									Contrôle parental
								</p>

								<h1 className="mt-1 text-3xl font-black">
									Paramètres
								</h1>

								<p className="mt-2 text-sm text-slate-500">
									Gérez la protection, le filtrage et le
									temps d’écran.
								</p>
							</div>
						</div>
					</header>

					<SettingsForm
						initialSettings={settings}
					/>

					{settings.length === 0 && (
						<section className="rounded-[28px] border border-dashed border-violet-200 bg-white/80 p-10 text-center shadow-lg">
							<Settings
								size={42}
								className="mx-auto text-slate-300"
							/>

							<h2 className="mt-4 text-2xl font-black">
								Aucun paramètre disponible
							</h2>

							<p className="mt-2 text-slate-500">
								Ajoutez d’abord un profil enfant.
							</p>
						</section>
					)}

					<ParentPinCard />
				</section>
			</section>
		</main>
	);
}