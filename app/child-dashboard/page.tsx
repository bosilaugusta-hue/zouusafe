import ChildFooter from "@/components/children/ChildFooter";
import ChildHeader from "@/components/children/ChildHeader";
import IdeasCard from "@/components/children/IdeasCard";
import SafetyCard from "@/components/children/SafetyCard";
import ScreenTimeTracker from "@/components/children/ScreenTimeTracker";
import SearchCategories from "@/components/children/SearchCategories";
import SearchHero from "@/components/children/SearchHero";
import SearchHistory from "@/components/children/SearchHistory";
import { getChildAssets } from "@/lib/get-child-assets";

type ChildDashboardPageProps = {
	searchParams: Promise<{
		childId?: string;
	}>;
};

type Child = {
	child_id: number;
	first_name: string;
	birth_date: string;
	gender: string;
	avatar_url: string;
	parent_id: number;
	screen_time_limit: number | null;
	screen_time_used: number | null;
	filter_level: string | null;
	safe_search: boolean | null;
};

async function getChild(childId: number): Promise<Child | null> {
	const response = await fetch(
		`http://localhost:3000/api/children/${childId}`,
		{
			cache: "no-store",
		},
	);

	if (!response.ok) {
		return null;
	}

	const data = (await response.json()) as {
		child: Child;
	};

	return data.child;
}

function MissingChildCard() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] px-6 py-10">
			<section className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/80 bg-white/90 p-8 text-center shadow-[0_24px_70px_rgba(91,33,182,0.16)] backdrop-blur-xl sm:p-10">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-200/35 blur-3xl"
				/>

				<div
					aria-hidden="true"
					className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-blue-200/30 blur-3xl"
				/>

				<div className="relative">
					<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-4xl shadow-inner">
						🦊
					</div>

					<p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-violet-600">
						ZouuSafe
					</p>

					<h1 className="mt-2 text-3xl font-black text-slate-950">
						Enfant introuvable
					</h1>

					<p className="mt-3 leading-7 text-slate-500">
						Le profil demandé n&apos;existe pas ou n&apos;est plus disponible.
					</p>
				</div>
			</section>
		</main>
	);
}

function ScreenLimitCard({
	childName,
	screenTimeLimit,
}: {
	childName: string;
	screenTimeLimit: number;
}) {
	return (
		<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] px-6 py-10">
			<section className="relative w-full max-w-xl overflow-hidden rounded-[34px] border border-white/80 bg-white/90 p-8 text-center shadow-[0_24px_70px_rgba(91,33,182,0.16)] backdrop-blur-xl sm:p-10">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-200/30 blur-3xl"
				/>

				<div
					aria-hidden="true"
					className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-violet-200/30 blur-3xl"
				/>

				<div className="relative">
					<div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 text-5xl shadow-inner">
						⏰
					</div>

					<p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-violet-600">
						Pause bien méritée
					</p>

					<h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
						Temps d&apos;écran terminé
					</h1>

					<p className="mt-5 text-lg leading-8 text-slate-600">
						Bravo {childName} !
						<br />
						Tu as utilisé tout ton temps d&apos;écran pour aujourd&apos;hui.
					</p>

					<div className="mt-8 rounded-[24px] border border-violet-100 bg-violet-50/90 p-5 shadow-inner">
						<p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600">
							Limite autorisée
						</p>

						<p className="mt-2 text-4xl font-black text-violet-900">
							{screenTimeLimit} minutes
						</p>
					</div>

					<p className="mt-7 text-sm font-semibold text-slate-500">
						Demande à ton parent si tu souhaites continuer.
					</p>
				</div>
			</section>
		</main>
	);
}

export default async function ChildDashboardPage({
	searchParams,
}: ChildDashboardPageProps) {
	const { childId: childIdParam } = await searchParams;
	const childId = Number(childIdParam);

	if (!Number.isInteger(childId) || childId <= 0) {
		return <MissingChildCard />;
	}

	const child = await getChild(childId);

	if (!child) {
		return <MissingChildCard />;
	}

	const assets = getChildAssets(child.avatar_url);

	const screenLimitReached =
		child.screen_time_limit !== null &&
		child.screen_time_used !== null &&
		child.screen_time_used >= child.screen_time_limit;

	if (screenLimitReached) {
		return (
			<ScreenLimitCard
				childName={child.first_name}
				screenTimeLimit={child.screen_time_limit ?? 0}
			/>
		);
	}

	return (
		<main className="min-h-screen overflow-hidden bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] text-slate-900">
			<section
				className="relative overflow-hidden bg-cover bg-top bg-no-repeat"
				style={{
					backgroundImage: "url('/backgrounds/clouds-bg.png')",
				}}
			>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl"
				/>

				<div
					aria-hidden="true"
					className="pointer-events-none absolute -right-20 top-32 h-72 w-72 rounded-full bg-violet-200/20 blur-3xl"
				/>

				<div className="relative">
					<ChildHeader
						childId={child.child_id}
						childName={child.first_name}
						avatarUrl={assets.profile}
					/>

					<div className="mx-auto w-full max-w-[1450px] px-4 pt-3 sm:px-6">
						<ScreenTimeTracker childId={child.child_id} />
					</div>

					<div className="relative z-10">
						<SearchHero
							childId={child.child_id}
							childName={child.first_name}
							standingAvatar={assets.tablet}
						/>
					</div>
				</div>
			</section>

			<section className="relative z-10 -mt-2">
				<SearchCategories childId={child.child_id} />
			</section>

			<section className="px-4 py-10 sm:px-6 sm:py-12">
	<div className="mx-auto w-full max-w-[1450px]">
		<section className="relative overflow-hidden rounded-[34px] border border-white/80 bg-gradient-to-r from-violet-100/80 via-fuchsia-50/80 to-orange-50/80 p-6 shadow-[0_18px_55px_rgba(91,33,182,0.10)] sm:p-8">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-violet-200/25 blur-3xl"
			/>

			<div
				aria-hidden="true"
				className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-orange-200/25 blur-3xl"
			/>

			<div className="relative">
				<div className="mb-7">
					<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
						Mon espace
					</p>

					<h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
						Bonjour {child.first_name}, découvre ton activité
					</h2>

					<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
						Retrouve tes dernières recherches, des idées adaptées à ton âge
						et reste en sécurité avec ZouuSafe.
					</p>
				</div>

				<div className="grid items-stretch gap-5 xl:grid-cols-[1fr_0.95fr_1fr]">
					<SearchHistory
						childId={child.child_id}
						childName={child.first_name}
					/>

					<SafetyCard />

					<IdeasCard />
				</div>
			</div>
		</section>
	</div>
</section>

			<ChildFooter />
		</main>
	);
}