"use client";

import {
	Camera,
	KeyRound,
	Mail,
	Pencil,
	ShieldCheck,
	UserRound,
	X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
	type FormEvent,
	type ReactNode,
	useEffect,
	useState,
} from "react";

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

type MessageType = "success" | "error" | null;

type ApiResponse = {
	message?: string;
	parent?: {
		firstName: string;
		lastName: string;
		email: string;
	};
};

function getImagePath(path: string) {
	return path.startsWith("/") ? path : `/${path}`;
}

export default function ParentProfileModal({
	isOpen,
	onClose,
	parent,
}: ParentProfileModalProps) {
	const router = useRouter();

	const [activeSection, setActiveSection] =
		useState<ActiveSection>("profile");

	const [firstName, setFirstName] = useState(parent.firstName);
	const [lastName, setLastName] = useState(parent.lastName);
	const [email, setEmail] = useState(parent.email);

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [informationMessage, setInformationMessage] = useState("");
	const [informationMessageType, setInformationMessageType] =
		useState<MessageType>(null);
	const [isSavingInformation, setIsSavingInformation] = useState(false);

	const [passwordMessage, setPasswordMessage] = useState("");

	const safeFirstName = firstName.trim() || "Parent";
	const safeLastName = lastName.trim();
	const safeEmail = email.trim() || "Adresse e-mail indisponible";

	const completeName = [safeFirstName, safeLastName]
		.filter(Boolean)
		.join(" ");

	const parentInitial = safeFirstName.charAt(0).toUpperCase() || "P";

	useEffect(() => {
		setFirstName(parent.firstName);
		setLastName(parent.lastName);
		setEmail(parent.email);
	}, [parent]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				onClose();
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose]);

	useEffect(() => {
		if (isOpen) {
			return;
		}

		setActiveSection("profile");

		setInformationMessage("");
		setInformationMessageType(null);
		setIsSavingInformation(false);

		setPasswordMessage("");
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
	}, [isOpen]);

	async function handleInformationSubmit(
		event: FormEvent<HTMLFormElement>,
	) {
		event.preventDefault();

		const cleanFirstName = firstName.trim();
		const cleanLastName = lastName.trim();
		const cleanEmail = email.trim();

		setInformationMessage("");
		setInformationMessageType(null);

		if (!cleanFirstName) {
			setInformationMessage("Le prénom est obligatoire.");
			setInformationMessageType("error");
			return;
		}

		if (!cleanEmail) {
			setInformationMessage("L’adresse e-mail est obligatoire.");
			setInformationMessageType("error");
			return;
		}

		setIsSavingInformation(true);

		try {
			const response = await fetch("/api/parent/profile", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName: cleanFirstName,
					lastName: cleanLastName,
					email: cleanEmail,
				}),
			});

			const data = (await response.json()) as ApiResponse;

			if (!response.ok) {
				setInformationMessage(
					data.message ?? "Impossible de modifier les informations.",
				);
				setInformationMessageType("error");
				return;
			}

			const updatedParent = data.parent;

			setFirstName(updatedParent?.firstName ?? cleanFirstName);
			setLastName(updatedParent?.lastName ?? cleanLastName);
			setEmail(updatedParent?.email ?? cleanEmail);

			setInformationMessage(
				data.message ?? "Vos informations ont été mises à jour.",
			);
			setInformationMessageType("success");

			router.refresh();
		} catch (error) {
			console.error(
				"Erreur lors de la mise à jour du profil :",
				error,
			);

			setInformationMessage(
				"Une erreur est survenue pendant l’enregistrement.",
			);
			setInformationMessageType("error");
		} finally {
			setIsSavingInformation(false);
		}
	}

	function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setPasswordMessage("");

		if (!currentPassword || !newPassword || !confirmPassword) {
			setPasswordMessage("Veuillez remplir tous les champs.");
			return;
		}

		if (newPassword.length < 8) {
			setPasswordMessage(
				"Le nouveau mot de passe doit contenir au moins 8 caractères.",
			);
			return;
		}

		if (newPassword !== confirmPassword) {
			setPasswordMessage(
				"Les deux nouveaux mots de passe ne correspondent pas.",
			);
			return;
		}

		setPasswordMessage(
			"La modification du mot de passe sera connectée à l’étape suivante.",
		);
	}

	function resetInformationForm() {
		setFirstName(parent.firstName);
		setLastName(parent.lastName);
		setEmail(parent.email);
		setInformationMessage("");
		setInformationMessageType(null);
	}

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
			<button
				type="button"
				aria-label="Fermer la fenêtre du profil"
				onClick={onClose}
				className="absolute inset-0 cursor-default bg-slate-950/45 backdrop-blur-sm"
			/>

			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="parent-profile-title"
				className="relative z-10 max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-[32px] border border-white/80 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.30)]"
			>
				<header className="relative overflow-hidden rounded-t-[32px] bg-gradient-to-br from-violet-100 via-fuchsia-50 to-blue-100 px-6 pb-7 pt-6 sm:px-8">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-violet-300/30 blur-3xl"
					/>

					<div
						aria-hidden="true"
						className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-blue-300/25 blur-3xl"
					/>

					<button
						type="button"
						onClick={onClose}
						aria-label="Fermer la fenêtre du profil"
						className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-600 shadow-sm transition hover:rotate-90 hover:bg-white hover:text-violet-600"
					>
						<X size={20} aria-hidden="true" />
					</button>

					<div className="relative flex flex-col items-center text-center">
						<div className="relative">
							<div
								aria-hidden="true"
								className="absolute inset-0 rounded-full bg-violet-300/50 blur-xl"
							/>

							{parent.avatarUrl ? (
								<Image
									src={getImagePath(parent.avatarUrl)}
									alt={`Photo de profil de ${completeName}`}
									width={120}
									height={120}
									priority
									className="relative h-[112px] w-[112px] rounded-full border-[6px] border-white object-cover shadow-xl"
								/>
							) : (
								<div
									role="img"
									aria-label={`Avatar de ${completeName}`}
									className="relative flex h-[112px] w-[112px] items-center justify-center rounded-full border-[6px] border-white bg-gradient-to-br from-violet-500 to-blue-500 text-4xl font-black text-white shadow-xl"
								>
									{parentInitial}
								</div>
							)}

							<button
								type="button"
								onClick={() => {
									setInformationMessage("");
									setInformationMessageType(null);
									setActiveSection("information");
								}}
								aria-label="Modifier la photo de profil"
								className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-violet-600 text-white shadow-lg transition hover:scale-105 hover:bg-violet-700"
							>
								<Camera size={17} aria-hidden="true" />
							</button>
						</div>

						<p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-violet-600">
							Compte parent
						</p>

						<h2
							id="parent-profile-title"
							className="mt-1 text-3xl font-black tracking-tight text-slate-950"
						>
							{completeName}
						</h2>

						<span className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700">
							<ShieldCheck size={16} aria-hidden="true" />
							Compte sécurisé
						</span>
					</div>
				</header>

				<nav
					aria-label="Sections du profil parent"
					className="grid grid-cols-3 border-b border-slate-100 bg-white px-4 pt-4 sm:px-6"
				>
					<ModalTab
						label="Mon profil"
						active={activeSection === "profile"}
						onClick={() => setActiveSection("profile")}
					/>

					<ModalTab
						label="Informations"
						active={activeSection === "information"}
						onClick={() => {
							setInformationMessage("");
							setInformationMessageType(null);
							setActiveSection("information");
						}}
					/>

					<ModalTab
						label="Sécurité"
						active={activeSection === "password"}
						onClick={() => {
							setPasswordMessage("");
							setActiveSection("password");
						}}
					/>
				</nav>

				<div className="p-5 sm:p-7">
					{activeSection === "profile" && (
						<section>
							<div className="space-y-3">
								<InformationRow
									icon={
										<UserRound
											size={20}
											aria-hidden="true"
										/>
									}
									label="Prénom"
									value={safeFirstName}
									iconClassName="bg-violet-100 text-violet-600"
								/>

								<InformationRow
									icon={
										<UserRound
											size={20}
											aria-hidden="true"
										/>
									}
									label="Nom"
									value={safeLastName || "Non renseigné"}
									iconClassName="bg-blue-100 text-blue-600"
								/>

								<InformationRow
									icon={
										<Mail
											size={20}
											aria-hidden="true"
										/>
									}
									label="Adresse e-mail"
									value={safeEmail}
									iconClassName="bg-pink-100 text-pink-600"
								/>
							</div>

							<div className="mt-6 grid gap-3 sm:grid-cols-2">
								<button
									type="button"
									onClick={() => {
										setInformationMessage("");
										setInformationMessageType(null);
										setActiveSection("information");
									}}
									className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
								>
									<Pencil size={17} aria-hidden="true" />
									Modifier mes informations
								</button>

								<button
									type="button"
									onClick={() => {
										setPasswordMessage("");
										setActiveSection("password");
									}}
									className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white px-5 text-sm font-black text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-50"
								>
									<KeyRound size={17} aria-hidden="true" />
									Changer le mot de passe
								</button>
							</div>
						</section>
					)}

					{activeSection === "information" && (
						<section>
							<div className="flex items-start gap-4 rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
								<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
									<Pencil size={20} aria-hidden="true" />
								</span>

								<div>
									<h3 className="font-black text-slate-950">
										Modifier mes informations
									</h3>

									<p className="mt-1 text-sm leading-5 text-slate-500">
										Modifiez votre prénom, votre nom et votre
										adresse e-mail.
									</p>
								</div>
							</div>

							<form
								onSubmit={handleInformationSubmit}
								className="mt-5 space-y-4"
							>
								<label
									htmlFor="parent-first-name"
									className="block"
								>
									<span className="text-sm font-black text-slate-700">
										Prénom
									</span>

									<input
										id="parent-first-name"
										name="firstName"
										type="text"
										value={firstName}
										onChange={(event) => {
											setFirstName(event.target.value);
											setInformationMessage("");
											setInformationMessageType(null);
										}}
										autoComplete="given-name"
										disabled={isSavingInformation}
										className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
									/>
								</label>

								<label
									htmlFor="parent-last-name"
									className="block"
								>
									<span className="text-sm font-black text-slate-700">
										Nom
									</span>

									<input
										id="parent-last-name"
										name="lastName"
										type="text"
										value={lastName}
										onChange={(event) => {
											setLastName(event.target.value);
											setInformationMessage("");
											setInformationMessageType(null);
										}}
										autoComplete="family-name"
										placeholder="Votre nom"
										disabled={isSavingInformation}
										className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
									/>
								</label>

								<label
									htmlFor="parent-email"
									className="block"
								>
									<span className="text-sm font-black text-slate-700">
										Adresse e-mail
									</span>

									<input
										id="parent-email"
										name="email"
										type="email"
										value={email}
										onChange={(event) => {
											setEmail(event.target.value);
											setInformationMessage("");
											setInformationMessageType(null);
										}}
										autoComplete="email"
										disabled={isSavingInformation}
										className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
									/>
								</label>

								{informationMessage && (
									<p
										role="status"
										className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
											informationMessageType === "success"
												? "border-emerald-100 bg-emerald-50 text-emerald-700"
												: "border-red-100 bg-red-50 text-red-700"
										}`}
									>
										{informationMessage}
									</p>
								)}

								<div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
									<button
										type="button"
										onClick={resetInformationForm}
										disabled={isSavingInformation}
										className="min-h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
									>
										Annuler les changements
									</button>

									<button
										type="submit"
										disabled={isSavingInformation}
										className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
									>
										<Pencil size={17} aria-hidden="true" />

										{isSavingInformation
											? "Enregistrement..."
											: "Enregistrer les modifications"}
									</button>
								</div>
							</form>
						</section>
					)}

					{activeSection === "password" && (
						<section>
							<div className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
								<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
									<KeyRound size={20} aria-hidden="true" />
								</span>

								<div>
									<h3 className="font-black text-slate-950">
										Changer mon mot de passe
									</h3>

									<p className="mt-1 text-sm leading-5 text-slate-500">
										L’ancien mot de passe devra être vérifié avant
										l’enregistrement du nouveau.
									</p>
								</div>
							</div>

							<form
								onSubmit={handlePasswordSubmit}
								className="mt-5 space-y-4"
							>
								<PasswordInput
									id="current-password"
									label="Mot de passe actuel"
									value={currentPassword}
									onChange={(value) => {
										setCurrentPassword(value);
										setPasswordMessage("");
									}}
									autoComplete="current-password"
									placeholder="Entrez votre mot de passe actuel"
								/>

								<PasswordInput
									id="new-password"
									label="Nouveau mot de passe"
									value={newPassword}
									onChange={(value) => {
										setNewPassword(value);
										setPasswordMessage("");
									}}
									autoComplete="new-password"
									placeholder="Au moins 8 caractères"
								/>

								<PasswordInput
									id="confirm-password"
									label="Confirmer le nouveau mot de passe"
									value={confirmPassword}
									onChange={(value) => {
										setConfirmPassword(value);
										setPasswordMessage("");
									}}
									autoComplete="new-password"
									placeholder="Confirmez le nouveau mot de passe"
								/>

								{passwordMessage && (
									<p className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
										{passwordMessage}
									</p>
								)}

								<button
									type="submit"
									className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
								>
									<KeyRound size={17} aria-hidden="true" />
									Enregistrer le mot de passe
								</button>
							</form>
						</section>
					)}
				</div>

				<footer className="flex justify-end border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-7">
					<button
						type="button"
						onClick={onClose}
						className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-100"
					>
						Fermer
					</button>
				</footer>
			</section>
		</div>
	);
}

function ModalTab({
	label,
	active,
	onClick,
}: {
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`border-b-2 px-2 pb-3 text-xs font-black transition sm:text-sm ${
				active
					? "border-violet-600 text-violet-700"
					: "border-transparent text-slate-400 hover:text-slate-700"
			}`}
		>
			{label}
		</button>
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
			<span
				className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}
			>
				{icon}
			</span>

			<div className="min-w-0">
				<p className="text-xs font-bold text-slate-400">
					{label}
				</p>

				<p className="mt-0.5 truncate font-black text-slate-900">
					{value}
				</p>
			</div>
		</div>
	);
}

function PasswordInput({
	id,
	label,
	value,
	onChange,
	autoComplete,
	placeholder,
}: {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	autoComplete: "current-password" | "new-password";
	placeholder: string;
}) {
	return (
		<label htmlFor={id} className="block">
			<span className="text-sm font-black text-slate-700">
				{label}
			</span>

			<input
				id={id}
				name={id}
				type="password"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				autoComplete={autoComplete}
				placeholder={placeholder}
				className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
			/>
		</label>
	);
}