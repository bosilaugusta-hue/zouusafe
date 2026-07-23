import ChildFooter from "@/components/children/ChildFooter";
import ChildHeader from "@/components/children/ChildHeader";
import IdeasCard from "@/components/children/IdeasCard";
import SafetyCard from "@/components/children/SafetyCard";
import SearchCategories from "@/components/children/SearchCategories";
import SearchHero from "@/components/children/SearchHero";
import SearchHistory from "@/components/children/SearchHistory";
import { getChildAssets } from "@/lib/get-child-assets";
import ScreenTimeTracker from "@/components/children/ScreenTimeTracker";

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
			<main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 via-violet-50 to-amber-50 px-6">
				<div className="rounded-3xl bg-white p-8 text-center shadow-md">
					<h1 className="text-2xl font-black text-slate-900">
						Enfant introuvable
					</h1>

					<p className="mt-3 text-slate-500">
						Le profil demandé n&apos;existe pas.
					</p>
				</div>
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
		<main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 via-violet-50 to-amber-50 px-6">
			<div className="max-w-xl rounded-[36px] border border-white/80 bg-white/95 p-10 text-center shadow-2xl">
				<div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 text-5xl">
					⏰
				</div>

				<h1 className="mt-6 text-4xl font-black text-slate-900">
					Temps d'écran terminé
				</h1>

				<p className="mt-5 text-lg leading-8 text-slate-600">
					Bravo !
					<br />
					Tu as utilisé tout ton temps d'écran pour aujourd'hui.
				</p>

				<div className="mt-8 rounded-3xl bg-violet-50 p-6">
					<p className="text-base font-semibold text-violet-700">
						Limite autorisée
					</p>

					<p className="mt-2 text-3xl font-black text-violet-900">
						{child.screen_time_limit} minutes
					</p>
				</div>

				<p className="mt-8 text-slate-500">
					Demande à ton parent si tu souhaites continuer.
				</p>
			</div>
		</main>
	);
}

	return (
		<main className="min-h-screen bg-gradient-to-b from-blue-50 via-violet-50 to-amber-50 text-slate-900">
			<div
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

				<ScreenTimeTracker
	childId={child.child_id}
/>

				<SearchHero
					childId={child.child_id}
					childName={child.first_name}
					standingAvatar={assets.tablet}
				/>
			</div>

			<SearchCategories childId={child.child_id} />

			<section className="px-6 py-10">
				<div className="mx-auto grid max-w-[1450px] gap-6 lg:grid-cols-[1.4fr_0.8fr_1fr]">
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