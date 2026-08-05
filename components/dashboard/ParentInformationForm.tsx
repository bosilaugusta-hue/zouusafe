"use client";

import { Pencil } from "lucide-react";
import { useState, type FormEvent } from "react";

type MessageType = "success" | "error" | null;

type ParentInformationFormProps = {
	initialFirstName: string;
	initialLastName: string;
	initialEmail: string;
	onSaved: (parent: { firstName: string; lastName: string; email: string }) => void;
};

type ProfileResponse = {
	message?: string;
	parent?: { firstName: string; lastName: string; email: string };
};

export default function ParentInformationForm({ initialFirstName, initialLastName, initialEmail, onSaved }: ParentInformationFormProps) {
	const [firstName, setFirstName] = useState(initialFirstName);
	const [lastName, setLastName] = useState(initialLastName);
	const [email, setEmail] = useState(initialEmail);
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState<MessageType>(null);
	const [isSaving, setIsSaving] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const cleanFirstName = firstName.trim();
		const cleanLastName = lastName.trim();
		const cleanEmail = email.trim();
		setMessage("");
		setMessageType(null);

		if (!cleanFirstName || !cleanEmail) {
			setMessage(!cleanFirstName ? "Le prénom est obligatoire." : "L’adresse e-mail est obligatoire.");
			setMessageType("error");
			return;
		}

		setIsSaving(true);
		try {
			const response = await fetch("/api/parent/profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ firstName: cleanFirstName, lastName: cleanLastName, email: cleanEmail }),
			});
			const data = (await response.json()) as ProfileResponse;
			if (!response.ok) {
				setMessage(data.message ?? "Impossible de modifier les informations.");
				setMessageType("error");
				return;
			}
			const updatedParent = {
				firstName: data.parent?.firstName ?? cleanFirstName,
				lastName: data.parent?.lastName ?? cleanLastName,
				email: data.parent?.email ?? cleanEmail,
			};
			setFirstName(updatedParent.firstName);
			setLastName(updatedParent.lastName);
			setEmail(updatedParent.email);
			onSaved(updatedParent);
			setMessage(data.message ?? "Vos informations ont été mises à jour.");
			setMessageType("success");
		} catch (error) {
			console.error("Erreur lors de la mise à jour du profil :", error);
			setMessage("Une erreur est survenue pendant l’enregistrement.");
			setMessageType("error");
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<section>
			<div className="mb-5 flex items-start gap-4 rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
				<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm"><Pencil size={20} aria-hidden="true" /></span>
				<div>
					<h3 className="font-black text-slate-950">Modifier mes informations</h3>
					<p className="mt-1 text-sm leading-5 text-slate-500">Modifiez votre prénom, votre nom et votre adresse e-mail.</p>
				</div>
			</div>
			<form onSubmit={handleSubmit} className="space-y-4">
				<TextInput id="parent-first-name" label="Prénom" value={firstName} onChange={setFirstName} autoComplete="given-name" disabled={isSaving} />
				<TextInput id="parent-last-name" label="Nom" value={lastName} onChange={setLastName} autoComplete="family-name" disabled={isSaving} />
				<TextInput id="parent-email" label="Adresse e-mail" value={email} onChange={setEmail} type="email" autoComplete="email" disabled={isSaving} />
				{message && <p role="status" className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${messageType === "success" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-red-100 bg-red-50 text-red-700"}`}>{message}</p>}
				<div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
					<button type="button" onClick={() => { setFirstName(initialFirstName); setLastName(initialLastName); setEmail(initialEmail); setMessage(""); setMessageType(null); }} disabled={isSaving} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60">Annuler</button>
					<button type="submit" disabled={isSaving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"><Pencil size={17} aria-hidden="true" />{isSaving ? "Enregistrement..." : "Enregistrer"}</button>
				</div>
			</form>
		</section>
	);
}

function TextInput({ id, label, value, onChange, type = "text", autoComplete, disabled }: { id: string; label: string; value: string; onChange: (value: string) => void; type?: "text" | "email"; autoComplete: string; disabled: boolean; }) {
	return <label htmlFor={id} className="block"><span className="text-sm font-black text-slate-700">{label}</span><input id={id} name={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} disabled={disabled} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50" /></label>;
}
