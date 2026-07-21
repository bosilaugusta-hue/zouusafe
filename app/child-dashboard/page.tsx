import ChildFooter from "@/components/children/ChildFooter";
import ChildHeader from "@/components/children/ChildHeader";
import IdeasCard from "@/components/children/IdeasCard";
import SearchHistory from "@/components/children/SearchHistory";
import SafetyCard from "@/components/children/SafetyCard";
import SearchCategories from "@/components/children/SearchCategories";
import SearchHero from "@/components/children/SearchHero";

type ChildDashboardPageProps = {
	searchParams: Promise<{
		childId?: string;
	}>;
};

export default async function ChildDashboardPage({
	searchParams,
}: ChildDashboardPageProps) {
	const { childId: childIdParam } = await searchParams;

	const childId = Number(childIdParam) || 1;

	const child = {
	id: childId,
	name: "Zoé",
	avatarUrl: "/avatars-profil/fille-15.png",
	standingAvatar: "/enfants/fille15-tablette.png",
};
	return (
		<main className="min-h-screen bg-gradient-to-b from-blue-50 via-violet-50 to-amber-50 text-slate-900">
			<div
				className="bg-cover bg-top bg-no-repeat"
				style={{
					backgroundImage: "url('/backgrounds/clouds-bg.png')",
				}}
			>
				<ChildHeader
					childId={child.id}
					childName={child.name}
					avatarUrl={child.avatarUrl}
				/>

				<SearchHero
	childId={child.id}
	childName={child.name}
	standingAvatar={child.standingAvatar}
/>
			</div>

			<SearchCategories childId={child.id} />

			<section className="px-6 py-10">
				<div className="mx-auto grid max-w-[1450px] gap-6 lg:grid-cols-[1.4fr_0.8fr_1fr]">
					<SearchHistory
    childId={child.id}
    childName={child.name}
/>
					<SafetyCard />

					<IdeasCard />
				</div>
			</section>

			<ChildFooter />
		</main>
	);
}