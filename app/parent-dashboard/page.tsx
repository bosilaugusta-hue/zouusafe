import AlertsCard from "@/components/dashboard/AlertsCard";
import ChildCard from "@/components/dashboard/ChildCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HistoryCard from "@/components/dashboard/HistoryCard";
import QuickSettings from "@/components/dashboard/QuickSettings";
import Sidebar from "@/components/dashboard/Sidebar";
import StatsCards from "@/components/dashboard/StatsCards";


async function getDashboardData() {
	const response = await fetch("http://localhost:3000/api/dashboard", {
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error("Impossible de récupérer les données du dashboard.");
	}

	return response.json();
}

export default async function ParentDashboardPage() {
	const dashboard = await getDashboardData();

	const child = dashboard.children[0] ?? {
		first_name: "Zoé",
		avatar_url: "zoe.png",
	};

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-6 text-slate-900">
			<section className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
				<Sidebar />

				<section className="space-y-6">
					<DashboardHeader
						parentName={dashboard.parent?.first_name ?? "Augusta"}
						childName={child.first_name}
					/>

					<StatsCards
						childrenCount={dashboard.stats.children}
						searchesCount={dashboard.stats.searches}
						blockedCount={dashboard.stats.blockedSites}
						screenTime={dashboard.stats.screenTime}
					/>

					<section className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
						<ChildCard firstName={child.first_name} avatar={child.avatar_url} />
						<AlertsCard alerts={dashboard.alerts} />
					</section>

					<section className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
						<HistoryCard history={dashboard.history} />
						<QuickSettings settings={dashboard.settings} />
					</section>
				</section>
			</section>
		</main>
	);
}
