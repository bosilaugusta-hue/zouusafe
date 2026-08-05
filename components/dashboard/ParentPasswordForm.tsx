"use client";

import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState, type FormEvent } from "react";

type MessageType = "success" | "error" | null;

type PasswordResponse = {
	message?: string;
};

export default function ParentPasswordForm() {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState<MessageType>(null);
	const [isSaving, setIsSaving] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setMessage("");
		setMessageType(null);

		if (!currentPassword || !newPassword || !confirmPassword) {
			setMessage("Veuillez remplir tous les champs.");
			setMessageType("error");
			return;
		}

		if (newPassword.length < 12) {
			setMessage("Le nouveau mot de passe doit contenir au moins 12 caractères.");
			setMessageType("error");
			return;
		}

		if (newPassword !== confirmPassword) {
			setMessage("Les deux nouveaux mots de passe ne correspondent pas.");
			setMessageType("error");
			return;
		}

		setIsSaving(true);

		try {
			const response = await fetch("/api/parent/password", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
			});

			const data = (await response.json()) as PasswordResponse;

			if (!response.ok) {
				setMessage(data.message ?? "Impossible de modifier le mot de passe.");
				setMessageType("error");
				return;
			}

			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setShowCurrent(false);
			setShowNew(false);
			setShowConfirm(false);
			setMessage(data.message ?? "Votre mot de passe a été modifié.");
			setMessageType("success");
		} catch (error) {
			console.error("Erreur lors de la modification du mot de passe :", error);
			setMessage("Une erreur est survenue pendant la modification.");
			setMessageType("error");
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<section>
			<div className="mb-5 flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
				<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
					<KeyRound size={20} aria-hidden="true" />
				</span>
				<div>
					<h3 className="font-black text-slate-950">Changer mon mot de passe</h3>
					<p className="mt-1 text-sm leading-5 text-slate-500">
						Entrez votre mot de passe actuel puis choisissez le nouveau.
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<PasswordInput id="current-password" label="Mot de passe actuel" value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" visible={showCurrent} onToggleVisibility={() => setShowCurrent((value) => !value)} disabled={isSaving} />
				<PasswordInput id="new-password" label="Nouveau mot de passe" value={newPassword} onChange={setNewPassword} autoComplete="new-password" visible={showNew} onToggleVisibility={() => setShowNew((value) => !value)} disabled={isSaving} />

				<div className="rounded-2xl bg-violet-50 px-4 py-3">
					<p className={`text-sm font-bold ${newPassword.length >= 12 ? "text-emerald-600" : "text-slate-500"}`}>
						{newPassword.length >= 12 ? "✓" : "○"} Au moins 12 caractères
					</p>
				</div>

				<PasswordInput id="confirm-password" label="Confirmer le mot de passe" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" visible={showConfirm} onToggleVisibility={() => setShowConfirm((value) => !value)} disabled={isSaving} />

				{message && (
					<p role="status" className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${messageType === "success" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-red-100 bg-red-50 text-red-700"}`}>
						{message}
					</p>
				)}

				<button type="submit" disabled={isSaving} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60">
					<KeyRound size={17} aria-hidden="true" />
					{isSaving ? "Enregistrement..." : "Enregistrer le mot de passe"}
				</button>
			</form>
		</section>
	);
}

function PasswordInput({ id, label, value, onChange, autoComplete, visible, onToggleVisibility, disabled }: { id: string; label: string; value: string; onChange: (value: string) => void; autoComplete: "current-password" | "new-password"; visible: boolean; onToggleVisibility: () => void; disabled: boolean; }) {
	return (
		<label htmlFor={id} className="block">
			<span className="text-sm font-black text-slate-700">{label}</span>
			<span className="relative mt-2 block">
				<input id={id} name={id} type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} disabled={disabled} className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-sm font-semibold outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50" />
				<button type="button" onClick={onToggleVisibility} disabled={disabled} aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"} className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-violet-50 hover:text-violet-600">
					{visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
				</button>
			</span>
		</label>
	);
}
