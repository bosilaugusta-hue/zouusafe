import { ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import Image from "next/image";

export default function SafetyCard() {
	return (
		<article className="relative flex h-full min-h-[330px] flex-col overflow-hidden rounded-[28px] border border-white/50 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-400 p-6 text-center text-white shadow-[0_18px_45px_rgba(124,58,237,0.28)]">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/15 blur-2xl"
			/>

			<div
				aria-hidden="true"
				className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-pink-300/20 blur-3xl"
			/>

			<div className="relative flex flex-1 flex-col items-center">
				<Image
					src="/logos/renard-protection.png"
					alt="Logo de protection ZouuSafe"
					width={100}
					height={100}
					className="h-20 w-20 object-contain drop-shadow-lg"
				/>

				<h2 className="mt-3 text-2xl font-black">
					Tu es en sécurité
				</h2>

				<p className="mt-2 max-w-[260px] text-sm font-medium leading-6 text-white/90">
					ZouuSafe protège tes recherches et t&apos;aide à découvrir des
					contenus adaptés.
				</p>

				<div className="mt-auto grid w-full grid-cols-3 gap-2 pt-6">
					<div className="rounded-2xl bg-white/90 px-2 py-3 shadow-sm">
						<ShieldCheck
							size={21}
							aria-hidden="true"
							className="mx-auto text-emerald-500"
						/>

						<p className="mt-2 text-[11px] font-black text-emerald-600">
							Sécurisé
						</p>
					</div>

					<div className="rounded-2xl bg-white/90 px-2 py-3 shadow-sm">
						<UsersRound
							size={21}
							aria-hidden="true"
							className="mx-auto text-blue-500"
						/>

						<p className="mt-2 text-[11px] font-black leading-4 text-blue-600">
							Adapté
							<br />
							aux enfants
						</p>
					</div>

					<div className="rounded-2xl bg-white/90 px-2 py-3 shadow-sm">
						<Sparkles
							size={21}
							aria-hidden="true"
							className="mx-auto text-violet-500"
						/>

						<p className="mt-2 text-[11px] font-black leading-4 text-violet-600">
							Sans
							<br />
							publicité
						</p>
					</div>
				</div>
			</div>
		</article>
	);
}