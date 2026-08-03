import { cookies } from "next/headers";

import AlertsCard from "@/components/dashboard/AlertsCard";
import ChildCard from "@/components/dashboard/ChildCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HistoryCard from "@/components/dashboard/HistoryCard";
import QuickSettings from "@/components/dashboard/QuickSettings";
import StatsCards from "@/components/dashboard/StatsCards";

type DashboardData = {
	parent: {
		first_name: string;
		avatar_url: string | null;
	};
	stats: {
		children: number;
		searches: number;
		blockedSites: number;
		screenTime: number;
	};
	children: Array<{
		child_id: number;
		first_name: string;
		birth_date: string;
		avatar_url: string | null;
		filter_level?: string | null;
		safe_search?: boolean | null;
	}>;
	alerts: Array<{
		alert_id: number;
		message: string;
		severity: string;
		created_at: string;
	}>;
	history: Array<{
		search_history_id: number;
		search_query: string;
		created_at: string;
	}>;
	settings: {
		screen_time_limit: number;
		screen_time_used: number;
		filter_level: string;
		safe_search: boolean;
	} | null;
};

async function getDashboardData(): Promise<DashboardData> {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("zouusafe_session");

	if (!sessionCookie) {
		throw new Error("Session utilisateur introuvable.");
	}

	const response = await fetch("http://localhost:3000/api/dashboard", {
		cache: "no-store",
		headers: {
			Cookie: `zouusafe_session=${sessionCookie.value}`,
		},
	});

	if (!response.ok) {
		throw new Error(
			"Impossible de récupérer les données du tableau de bord.",
		);
	}

	return response.json();
}

export default async function ParentDashboardPage() {
	const dashboard = await getDashboardData();

	const firstChild = dashboard.children[0];
	const firstChildName = firstChild?.first_name ?? "votre enfant";

	const firstSettings = {
		child_id: firstChild?.child_id ?? 0,
		first_name: firstChildName,
		screen_time_limit: dashboard.settings?.screen_time_limit ?? 0,
		screen_time_used: dashboard.settings?.screen_time_used ?? 0,
		filter_level: dashboard.settings?.filter_level ?? "standard",
		safe_search: dashboard.settings?.safe_search ?? true,
	};

	const formattedHistory = dashboard.history.map((item) => ({
		search_history_id: item.search_history_id,
		search_query: item.search_query,
		created_at: item.created_at,
		first_name: firstChildName,
	}));

	return (
		<main className="space-y-5">
			<section className="relative">
				<DashboardHeader
					parentName={dashboard.parent.first_name}
					childName={firstChildName}
				/>

				<div className="relative z-10 -mt-3">
					<StatsCards
						childrenCount={dashboard.stats.children}
						searchesCount={dashboard.stats.searches}
						blockedCount={dashboard.stats.blockedSites}
						screenTime={dashboard.stats.screenTime}
					/>
				</div>
			</section>

			<section className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
				<ChildCard childList={dashboard.children} />

				<AlertsCard alerts={dashboard.alerts} />
			</section>

			<section className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
				<HistoryCard history={formattedHistory} />

				<QuickSettings settings={firstSettings} />
			</section>
		</main>
	);
}