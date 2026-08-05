"use client";

import { KeyRound, Mail, Pencil, UserRound } from "lucide-react";
import type { ReactNode } from "react";

type ParentProfileOverviewProps = {
	firstName: string;
	lastName: string;
	email: string;
	onEditInformation: () => void;
	onEditPassword: () => void;
};

export default function ParentProfileOverview({
	firstName,
	lastName,
	email,
	onEditInformation,
	onEditPassword,
}: ParentProfileOverviewProps) {
	return (
		<section>
			<div className="space-y-3">
				<InformationRow
					icon={<UserRound size={20} aria-hidden="true" />}
					label="Prénom"
					value={firstName || "Parent"}
					iconClassName="bg-violet-100 text-violet-600"
				/>
				<InformationRow
					icon={<UserRound size={20} aria-hidden="true" />}
					label="Nom"
					value={lastName || "Non renseigné"}
					iconClassName="bg-blue-100 text-blue-600"
				/>
				<InformationRow
					icon={<Mail size={20} aria-hidden="true" />}
					label="Adresse e-mail"
					value={email || "Adresse e-mail indisponible"}
					iconClassName="bg-pink-100 text-pink-600"
				/>
			</div>

			<div className="mt-6 grid gap-3 sm:grid-cols-2">
				<button
					type="button"
					onClick={onEditInformation}
					className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
				>
					<Pencil size={17} aria-hidden="true" />
					Modifier mes informations
				</button>
				<button
					type="button"
					onClick={onEditPassword}
					className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white px-5 text-sm font-black text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-50"
				>
					<KeyRound size={17} aria-hidden="true" />
					Changer le mot de passe
				</button>
			</div>
		</section>
	);
}

function InformationRow({
	icon,
	label,
	value,
	iconClassName,
}: {
	icon: ReactNode;
	label: string;
	value: string;
	iconClassName: string;
}) {
	return (
		<div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
			<span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}>
				{icon}
			</span>
			<div className="min-w-0">
				<p className="text-xs font-bold text-slate-400">{label}</p>
				<p className="mt-0.5 truncate font-black text-slate-900">{value}</p>
			</div>
		</div>
	);
}
