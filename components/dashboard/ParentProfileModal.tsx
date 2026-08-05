"use client";

import { ShieldCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ParentAvatarUploader from "@/components/dashboard/ParentAvatarUploader";
import ParentInformationForm from "@/components/dashboard/ParentInformationForm";
import ParentPasswordForm from "@/components/dashboard/ParentPasswordForm";
import ParentProfileOverview from "@/components/dashboard/ParentProfileOverview";
import ProfileModalTab from "@/components/dashboard/ProfileModalTab";

type ParentProfileModalProps = {
	isOpen: boolean;
	onClose: () => void;
	parent: {
		firstName: string;
		lastName: string;
		email: string;
		avatarUrl: string | null;
	};
};

type ActiveSection = "profile" | "information" | "password";

export default function ParentProfileModal({ isOpen, onClose, parent }: ParentProfileModalProps) {
	const router = useRouter();
	const [activeSection, setActiveSection] = useState<ActiveSection>("profile");
	const [firstName, setFirstName] = useState(parent.firstName);
	const [lastName, setLastName] = useState(parent.lastName);
	const [email, setEmail] = useState(parent.email);
	const [avatarUrl, setAvatarUrl] = useState(parent.avatarUrl);

	const safeFirstName = firstName.trim() || "Parent";
	const safeLastName = lastName.trim();
	const completeName = [safeFirstName, safeLastName].filter(Boolean).join(" ");
	const parentInitial = safeFirstName.charAt(0).toUpperCase() || "P";

	useEffect(() => {
		setFirstName(parent.firstName);
		setLastName(parent.lastName);
		setEmail(parent.email);
		setAvatarUrl(parent.avatarUrl);
	}, [parent]);

	useEffect(() => {
		if (!isOpen) return;
		function handleKeyDown(event: KeyboardEvent) { if (event.key === "Escape") onClose(); }
		document.addEventListener("keydown", handleKeyDown);
		document.body.style.overflow = "hidden";
		return () => { document.removeEventListener("keydown", handleKeyDown); document.body.style.overflow = ""; };
	}, [isOpen, onClose]);

	useEffect(() => { if (!isOpen) setActiveSection("profile"); }, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
			<button type="button" aria-label="Fermer la fenêtre du profil" onClick={onClose} className="absolute inset-0 cursor-default bg-slate-950/45 backdrop-blur-sm" />
			<section role="dialog" aria-modal="true" aria-labelledby="parent-profile-title" className="relative z-10 max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-[32px] border border-white/80 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.30)]">
				<header className="relative overflow-hidden rounded-t-[32px] bg-gradient-to-br from-violet-100 via-fuchsia-50 to-blue-100 px-6 pb-7 pt-6 sm:px-8">
					<button type="button" onClick={onClose} aria-label="Fermer la fenêtre du profil" className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-600 shadow-sm transition hover:rotate-90 hover:text-violet-600"><X size={20} aria-hidden="true" /></button>
					<ParentAvatarUploader currentAvatarUrl={avatarUrl} parentName={completeName} parentInitial={parentInitial} onSaved={(newAvatarUrl) => { setAvatarUrl(newAvatarUrl); router.refresh(); }} />
					<div className="mt-5 text-center">
						<p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">Compte parent</p>
						<h2 id="parent-profile-title" className="mt-1 text-3xl font-black text-slate-950">{completeName}</h2>
						<span className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700"><ShieldCheck size={16} aria-hidden="true" />Compte sécurisé</span>
					</div>
				</header>

				<nav aria-label="Sections du profil parent" className="grid grid-cols-3 border-b border-slate-100 px-4 pt-4 sm:px-6">
					<ProfileModalTab label="Mon profil" active={activeSection === "profile"} onClick={() => setActiveSection("profile")} />
					<ProfileModalTab label="Informations" active={activeSection === "information"} onClick={() => setActiveSection("information")} />
					<ProfileModalTab label="Sécurité" active={activeSection === "password"} onClick={() => setActiveSection("password")} />
				</nav>

				<div className="p-5 sm:p-7">
					{activeSection === "profile" && <ParentProfileOverview firstName={safeFirstName} lastName={safeLastName} email={email} onEditInformation={() => setActiveSection("information")} onEditPassword={() => setActiveSection("password")} />}
					{activeSection === "information" && <ParentInformationForm initialFirstName={firstName} initialLastName={lastName} initialEmail={email} onSaved={(updatedParent) => { setFirstName(updatedParent.firstName); setLastName(updatedParent.lastName); setEmail(updatedParent.email); router.refresh(); }} />}
					{activeSection === "password" && <ParentPasswordForm />}
				</div>

				<footer className="flex justify-end border-t border-slate-100 bg-slate-50/70 px-5 py-4">
					<button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-100">Fermer</button>
				</footer>
			</section>
		</div>
	);
}
