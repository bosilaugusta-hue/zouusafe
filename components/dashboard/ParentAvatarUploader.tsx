"use client";

import { Camera, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";

type ParentAvatarUploaderProps = { currentAvatarUrl: string | null; parentName: string; parentInitial: string; onSaved: (avatarUrl: string) => void; };
type AvatarResponse = { message?: string; avatarUrl?: string; };
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
function getImagePath(path: string) { return path.startsWith("/") ? path : `/${path}`; }

export default function ParentAvatarUploader({ currentAvatarUrl, parentName, parentInitial, onSaved }: ParentAvatarUploaderProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const displayedAvatarUrl = previewUrl ?? (currentAvatarUrl ? getImagePath(currentAvatarUrl) : null);

	function handleSelection(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		setMessage(""); setMessageType(null);
		if (!file) return;
		if (!ALLOWED_TYPES.includes(file.type)) { setMessage("Choisissez une image JPG, PNG ou WebP."); setMessageType("error"); event.target.value = ""; return; }
		if (file.size > MAX_FILE_SIZE) { setMessage("La photo ne doit pas dépasser 5 Mo."); setMessageType("error"); event.target.value = ""; return; }
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setSelectedFile(file);
		setPreviewUrl(URL.createObjectURL(file));
	}

	function cancelSelection() {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setSelectedFile(null); setPreviewUrl(null); setMessage(""); setMessageType(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	async function handleUpload() {
		if (!selectedFile) { setMessage("Veuillez sélectionner une photo."); setMessageType("error"); return; }
		setIsSaving(true); setMessage(""); setMessageType(null);
		try {
			const formData = new FormData(); formData.append("avatar", selectedFile);
			const response = await fetch("/api/parent/avatar", { method: "PATCH", body: formData });
			const data = (await response.json()) as AvatarResponse;
			if (!response.ok || !data.avatarUrl) { setMessage(data.message ?? "Impossible de modifier la photo."); setMessageType("error"); return; }
			onSaved(data.avatarUrl);
			if (previewUrl) URL.revokeObjectURL(previewUrl);
			setSelectedFile(null); setPreviewUrl(null);
			if (fileInputRef.current) fileInputRef.current.value = "";
			setMessage(data.message ?? "Votre photo a été mise à jour."); setMessageType("success");
		} catch (error) {
			console.error("Erreur lors de l’envoi de la photo :", error);
			setMessage("Une erreur est survenue pendant l’envoi."); setMessageType("error");
		} finally { setIsSaving(false); }
	}

	return <div className="flex flex-col items-center text-center">
		<div className="relative">
			{displayedAvatarUrl ? <Image src={displayedAvatarUrl} alt={`Photo de profil de ${parentName}`} width={120} height={120} unoptimized={Boolean(previewUrl)} className="h-[112px] w-[112px] rounded-full border-[6px] border-white object-cover shadow-xl" /> : <div role="img" aria-label={`Avatar de ${parentName}`} className="flex h-[112px] w-[112px] items-center justify-center rounded-full border-[6px] border-white bg-gradient-to-br from-violet-500 to-blue-500 text-4xl font-black text-white shadow-xl">{parentInitial}</div>}
			<button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Choisir une nouvelle photo" className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-violet-600 text-white shadow-lg transition hover:scale-105 hover:bg-violet-700"><Camera size={17} aria-hidden="true" /></button>
			<input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleSelection} className="sr-only" />
		</div>
		{selectedFile && <div className="mt-5 w-full max-w-sm rounded-2xl border border-violet-100 bg-white/80 p-4"><p className="text-sm font-black text-slate-900">Nouvelle photo sélectionnée</p><p className="mt-1 truncate text-xs text-slate-500">{selectedFile.name}</p><div className="mt-4 grid grid-cols-2 gap-3"><button type="button" onClick={cancelSelection} disabled={isSaving} className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 disabled:opacity-60">Annuler</button><button type="button" onClick={handleUpload} disabled={isSaving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white disabled:opacity-60"><Upload size={16} aria-hidden="true" />{isSaving ? "Envoi..." : "Enregistrer"}</button></div></div>}
		{message && <p role="status" className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${messageType === "success" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-red-100 bg-red-50 text-red-700"}`}>{message}</p>}
	</div>;
}
