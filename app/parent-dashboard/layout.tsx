import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import MobileParentMenu from "@/components/dashboard/MobileParentMenu";
import Sidebar from "@/components/dashboard/Sidebar";

type ParentDashboardLayoutProps = {
	children: ReactNode;
};

type DashboardLayoutResponse = {
	parent: {
	first_name: string;
	last_name: string | null;
	email: string;
	avatar_url: string | null;
} | null;
};

async function getDashboardParent() {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("zouusafe_session");

	if (!sessionCookie) {
		redirect("/login");
	}

	const headersList = await headers();
	const host = headersList.get("host");

	if (!host) {
		throw new Error("Impossible de déterminer l’adresse de l’application.");
	}

	const protocol =
		process.env.NODE_ENV === "development" ? "http" : "https";

	const response = await fetch(`${protocol}://${host}/api/dashboard`, {
		cache: "no-store",
		headers: {
			Cookie: `zouusafe_session=${sessionCookie.value}`,
		},
	});

	if (response.status === 401 || response.status === 404) {
		redirect("/login");
	}

	if (!response.ok) {
		throw new Error(
			"Impossible de récupérer les informations du parent.",
		);
	}

	const data = (await response.json()) as DashboardLayoutResponse;

	if (!data.parent) {
		redirect("/login");
	}

	return data.parent;
}

export default async function ParentDashboardLayout({
	children,
}: ParentDashboardLayoutProps) {
	const parent = await getDashboardParent();

	return (
		<main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] p-4 text-slate-900 sm:p-6">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -left-32 -top-32 h-[360px] w-[360px] rounded-full bg-blue-300/20 blur-3xl"
			/>

			<div
				aria-hidden="true"
				className="pointer-events-none absolute -right-32 top-1/3 h-[420px] w-[420px] rounded-full bg-violet-300/20 blur-3xl"
			/>

			<div
				aria-hidden="true"
				className="pointer-events-none absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-amber-200/20 blur-3xl"
			/>

			<MobileParentMenu
	parentName={parent.first_name}
	parentLastName={parent.last_name}
	parentEmail={parent.email}
	parentAvatar={parent.avatar_url}
/>

			<section className="relative mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				<Sidebar
					parentName={parent.first_name}
					parentAvatar={parent.avatar_url}
				/>

				<section className="min-w-0">
					{children}
				</section>
			</section>
		</main>
	);
}