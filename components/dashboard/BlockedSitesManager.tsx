"use client";

import { Ban, Plus, ShieldX, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

type Child = {
	child_id: number;
	first_name: string;
};

type BlockedSite = {
	blocked_site_id: number;
	child_id: number;
	domain: string;
	reason: string;
	created_at: string;
	first_name: string;
};

type DashboardResponse = {
	children: Child[];
};

type BlockedSitesResponse = {
	blockedSites: BlockedSite[];
	message?: string;
};

export default function BlockedSitesManager() {
	const [children, setChildren] = useState<Child[]>([]);
	const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);

	const [childId, setChildId] = useState("");
	const [domain, setDomain] = useState("");
	const [reason, setReason] = useState("Choix du parent");

	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		async function loadData() {
			try {
				const [childrenResponse, blockedResponse] = await Promise.all([
					fetch("/api/dashboard", {
						cache: "no-store",
					}),
					fetch("/api/blocked-sites", {
						cache: "no-store",
					}),
				]);

				if (!childrenResponse.ok || !blockedResponse.ok) {
					throw new Error("Impossible de charger les données.");
				}

				const dashboard =
					(await childrenResponse.json()) as DashboardResponse;

				const blocked =
					(await blockedResponse.json()) as BlockedSitesResponse;

				setChildren(dashboard.children);
				setBlockedSites(blocked.blockedSites);

				if (dashboard.children.length > 0) {
					setChildId(String(dashboard.children[0].child_id));
				}
			} catch (error) {
				console.error(error);
				setMessage("Impossible de charger les sites interdits.");
			} finally {
				setIsLoading(false);
			}
		}

		loadData();
	}, []);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const cleanDomain = domain.trim();

		if (!childId || !cleanDomain) {
			setMessage("Choisissez un enfant et indiquez un site.");
			return;
		}

		try {
			setIsSaving(true);
			setMessage("");

			const response = await fetch("/api/blocked-sites", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					childId: Number(childId),
					domain: cleanDomain,
					reason,
				}),
			});

			const data = (await response.json()) as {
				message?: string;
			};

			if (!response.ok) {
				setMessage(data.message ?? "Impossible d’ajouter ce site.");
				return;
			}

			setDomain("");
			setReason("Choix du parent");
			setMessage("Le site a bien été ajouté.");

			await refreshBlockedSites();
		} catch (error) {
			console.error(error);
			setMessage("Une erreur est survenue.");
		} finally {
			setIsSaving(false);
		}
	}

	async function refreshBlockedSites() {
		const response = await fetch("/api/blocked-sites", {
			cache: "no-store",
		});

		if (!response.ok) {
			return;
		}

		const data = (await response.json()) as BlockedSitesResponse;

		setBlockedSites(data.blockedSites);
	}

	async function handleDelete(blockedSiteId: number) {
		try {
			const response = await fetch(
				`/api/blocked-sites?id=${blockedSiteId}`,
				{
					method: "DELETE",
				},
			);

			const data = (await response.json()) as {
				message?: string;
			};

			if (!response.ok) {
				setMessage(data.message ?? "Impossible de supprimer ce site.");
				return;
			}

			setMessage("Le site a été retiré des interdictions.");

			await refreshBlockedSites();
		} catch (error) {
			console.error(error);
			setMessage("Une erreur est survenue.");
		}
	}

	if (isLoading) {
		return (
			<section className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(30,41,59,0.08)]">
				<p className="text-sm font-semibold text-slate-500">
					Chargement des sites interdits...
				</p>
			</section>
		);
	}

	return (
		<section className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(30,41,59,0.08)] backdrop-blur-xl">
			<header className="mb-6 flex items-start gap-4">
				<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
					<ShieldX size={23} aria-hidden="true" />
				</span>

				<div>
					<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
						Contrôle parental
					</p>

					<h2 className="mt-1 text-2xl font-black text-slate-950">
						Sites interdits par le parent
					</h2>

					<p className="mt-1.5 text-sm text-slate-500">
						Ajoutez les sites auxquels votre enfant ne doit pas accéder.
					</p>
				</div>
			</header>

			<form
				onSubmit={handleSubmit}
				className="grid gap-4 rounded-[24px] bg-violet-50/60 p-5 lg:grid-cols-[0.8fr_1.3fr_1fr_auto] lg:items-end"
			>
				<label className="block">
					<span className="text-sm font-black text-slate-700">
						Enfant
					</span>

					<select
						value={childId}
						onChange={(event) => setChildId(event.target.value)}
						className="mt-2 h-12 w-full rounded-2xl border border-violet-100 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-violet-400"
					>
						{children.map((child) => (
							<option
								key={child.child_id}
								value={child.child_id}
							>
								{child.first_name}
							</option>
						))}
					</select>
				</label>

				<label className="block">
					<span className="text-sm font-black text-slate-700">
						Site à bloquer
					</span>

					<input
						type="text"
						value={domain}
						onChange={(event) => setDomain(event.target.value)}
						placeholder="exemple.com"
						className="mt-2 h-12 w-full rounded-2xl border border-violet-100 bg-white px-4 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:border-violet-400"
					/>
				</label>

				<label className="block">
					<span className="text-sm font-black text-slate-700">
						Raison
					</span>

					<select
						value={reason}
						onChange={(event) => setReason(event.target.value)}
						className="mt-2 h-12 w-full rounded-2xl border border-violet-100 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-violet-400"
					>
						<option value="Choix du parent">Choix du parent</option>
						<option value="Réseau social">Réseau social</option>
						<option value="Contenu adulte">Contenu adulte</option>
						<option value="Contenu violent">Contenu violent</option>
						<option value="Autre">Autre</option>
					</select>
				</label>

				<button
					type="submit"
					disabled={isSaving}
					className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"
				>
					<Plus size={18} aria-hidden="true" />
					{isSaving ? "Ajout..." : "Bloquer"}
				</button>
			</form>

			{message && (
				<p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-600">
					{message}
				</p>
			)}

			<div className="mt-6">
				<h3 className="text-lg font-black text-slate-900">
					Liste des sites interdits
				</h3>

				{blockedSites.length === 0 ? (
					<div className="mt-4 rounded-[22px] border border-dashed border-violet-200 bg-violet-50/40 px-5 py-8 text-center">
						<Ban
							size={24}
							aria-hidden="true"
							className="mx-auto text-violet-500"
						/>

						<p className="mt-2 text-sm font-bold text-slate-600">
							Aucun site ajouté par le parent.
						</p>
					</div>
				) : (
					<ul className="mt-4 space-y-3">
						{blockedSites.map((site) => (
							<li
								key={site.blocked_site_id}
								className="flex flex-col gap-4 rounded-[20px] border border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
							>
								<div>
									<p className="font-black text-slate-900">
										{site.domain}
									</p>

									<p className="mt-1 text-xs font-semibold text-slate-500">
										{site.first_name} · {site.reason}
									</p>
								</div>

								<button
									type="button"
									onClick={() =>
										handleDelete(site.blocked_site_id)
									}
									className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
								>
									<Trash2 size={15} aria-hidden="true" />
									Supprimer
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
}