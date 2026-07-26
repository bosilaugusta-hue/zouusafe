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

export default async function ChildDashboardPage({
	searchParams,
}: ChildDashboardPageProps) {
	const { childId: childIdParam } = await searchParams;
	const childId = Number(childIdParam) || 1;

	const child = await getChild(childId);

	if (!child) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] px-6">
				<section className="w-full max-w-lg rounded-[30px] border border-white/80 bg-white/90 p-10 text-center shadow-2xl backdrop-blur-xl">
					<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-4xl">
						🦊
					</div>

					<h1 className="mt-6 text-3xl font-black text-slate-900">
						Enfant introuvable
					</h1>

					<p className="mt-3 leading-7 text-slate-500">
						Le profil demandé n&apos;existe pas ou n&apos;est plus
						disponible.
					</p>
				</section>
			</main>
		);
	}

	const assets = getChildAssets(child.avatar_url);

	const screenLimitReached =
		child.screen_time_limit !== null &&
		child.screen_time_used !== null &&
		child.screen_time_used >= child.screen_time_limit;

	if (screenLimitReached) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] px-6 py-10">
				<section className="w-full max-w-xl rounded-[32px] border border-white/80 bg-white/90 p-10 text-center shadow-2xl backdrop-blur-xl">
					<div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 text-5xl shadow-inner">
						⏰
					</div>

					<p className="mt-6 text-sm font-black uppercase tracking-[0.15em] text-violet-500">
						Pause bien méritée
					</p>

					<h1 className="mt-2 text-4xl font-black text-slate-900">
						Temps d&apos;écran terminé
					</h1>

					<p className="mt-5 text-lg leading-8 text-slate-600">
						Bravo {child.first_name} !
						<br />
						Tu as utilisé tout ton temps d&apos;écran pour aujourd&apos;hui.
					</p>

					<div className="mt-8 rounded-3xl border border-violet-100 bg-violet-50/90 p-6 shadow-inner">
						<p className="text-sm font-black uppercase tracking-[0.12em] text-violet-600">
							Limite autorisée
						</p>

						<p className="mt-2 text-4xl font-black text-violet-900">
							{child.screen_time_limit} minutes
						</p>
					</div>

					<p className="mt-8 text-slate-500">
						Demande à ton parent si tu souhaites continuer.
					</p>
				</section>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] text-slate-900">
			<section
				className="bg-cover bg-top bg-no-repeat"
				style={{
					backgroundImage: "url('/backgrounds/clouds-bg.png')",
				}}
			>
				<ChildHeader
					childId={child.child_id}
					childName={child.first_name}
					avatarUrl={assets.profile}
				/>

				<div className="mx-auto w-full max-w-[1450px] px-6 pt-4">
					<ScreenTimeTracker childId={child.child_id} />
				</div>

				<SearchHero
					childId={child.child_id}
					childName={child.first_name}
					standingAvatar={assets.tablet}
				/>
			</section>

			<section className="mt-8">
				<SearchCategories childId={child.child_id} />
			</section>

			<section className="px-6 py-12">
				<div className="mx-auto grid w-full max-w-[1450px] gap-6 lg:grid-cols-[1.4fr_0.8fr_1fr]">
					<SearchHistory
						childId={child.child_id}
						childName={child.first_name}
					/>

					<SafetyCard />

					<IdeasCard />
				</div>
			</section>

			<ChildFooter />
		</main>
	);
}