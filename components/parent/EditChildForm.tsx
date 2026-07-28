"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Child = {
	child_id: number;
	first_name: string;
	birth_date: string;
	gender: string;
	avatar_url: string;
};

type EditChildFormProps = {
	child: Child;
};

const avatars = ["/avatars-profil/fille-15.png", "/avatars-profil/boy-22.png"];

export default function EditChildForm({ child }: EditChildFormProps) {
	const router = useRouter();

	const [firstName, setFirstName] = useState(child.first_name);
	const [birthDate, setBirthDate] = useState(child.birth_date);
	const [gender, setGender] = useState(child.gender);
	const [avatarUrl, setAvatarUrl] = useState(child.avatar_url);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setError("");
		setIsSubmitting(true);

		try {
			const response = await fetch(`/api/children/${child.child_id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName,
					birthDate,
					gender,
					avatarUrl,
				}),
			});

			const data = (await response.json()) as {
				message?: string;
			};

			if (!response.ok) {
				throw new Error(data.message || "Impossible de modifier le profil.");
			}

			router.push("/parent-dashboard");
			router.refresh();
		} catch (error) {
			setError(
				error instanceof Error ? error.message : "Une erreur est survenue.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	const isFormValid =
		firstName.trim() !== "" &&
		birthDate !== "" &&
		gender !== "" &&
		avatarUrl !== "";

	return (
		<form onSubmit={handleSubmit} className="mt-8 space-y-5">
			<div>
				<label
					htmlFor="firstName"
					className="mb-2 block text-sm font-bold text-slate-700"
				>
					Prénom
				</label>

				<input
					id="firstName"
					type="text"
					value={firstName}
					onChange={(event) => setFirstName(event.target.value)}
					placeholder="Prénom de l’enfant"
					className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
					required
				/>
			</div>

			<div>
				<label
					htmlFor="birthDate"
					className="mb-2 block text-sm font-bold text-slate-700"
				>
					Date de naissance
				</label>

				<input
					id="birthDate"
					type="date"
					value={birthDate}
					onChange={(event) => setBirthDate(event.target.value)}
					className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
					required
				/>
			</div>

			<fieldset>
				<legend className="mb-3 text-sm font-bold text-slate-700">Genre</legend>

				<div className="grid grid-cols-3 gap-3">
					<label
						className={`cursor-pointer rounded-xl border px-3 py-3 text-center text-sm font-bold transition ${
							gender === "girl"
								? "border-violet-500 bg-violet-100 text-violet-700"
								: "border-slate-200 bg-white text-slate-600"
						}`}
					>
						<input
							type="radio"
							name="gender"
							value="girl"
							checked={gender === "girl"}
							onChange={(event) => setGender(event.target.value)}
							className="sr-only"
						/>
						Fille
					</label>

					<label
						className={`cursor-pointer rounded-xl border px-3 py-3 text-center text-sm font-bold transition ${
							gender === "boy"
								? "border-blue-500 bg-blue-100 text-blue-700"
								: "border-slate-200 bg-white text-slate-600"
						}`}
					>
						<input
							type="radio"
							name="gender"
							value="boy"
							checked={gender === "boy"}
							onChange={(event) => setGender(event.target.value)}
							className="sr-only"
						/>
						Garçon
					</label>

					<label
						className={`cursor-pointer rounded-xl border px-3 py-3 text-center text-sm font-bold transition ${
							gender === "other"
								? "border-amber-500 bg-amber-100 text-amber-700"
								: "border-slate-200 bg-white text-slate-600"
						}`}
					>
						<input
							type="radio"
							name="gender"
							value="other"
							checked={gender === "other"}
							onChange={(event) => setGender(event.target.value)}
							className="sr-only"
						/>
						Autre
					</label>
				</div>
			</fieldset>

			<div>
				<p className="mb-3 text-sm font-bold text-slate-700">
					Choisir un avatar
				</p>

				<div className="mb-4 flex items-center gap-4 rounded-2xl bg-violet-50 p-4">
					<div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-violet-400 bg-white">
						<Image
							src={avatarUrl}
							alt={`Avatar sélectionné pour ${firstName}`}
							fill
							className="object-cover"
						/>
					</div>

					<div>
						<p className="font-black text-violet-700">Avatar sélectionné</p>

						<p className="mt-1 text-sm text-slate-500">
							Cliquez sur une image pour la choisir.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					{avatars.map((avatar) => {
						const isSelected = avatarUrl === avatar;

						return (
							<button
								key={avatar}
								type="button"
								onClick={() => setAvatarUrl(avatar)}
								className={`relative aspect-square overflow-hidden rounded-2xl border-4 bg-white transition hover:-translate-y-1 hover:shadow-lg ${
									isSelected
										? "border-violet-500 shadow-md"
										: "border-transparent"
								}`}
								aria-label="Sélectionner cet avatar"
							>
								<Image src={avatar} alt="" fill className="object-cover" />

								{isSelected && (
									<span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-black text-white">
										✓
									</span>
								)}
							</button>
						);
					})}
				</div>
			</div>

			{error && (
				<p
					role="alert"
					className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
				>
					{error}
				</p>
			)}

			<button
				type="submit"
				disabled={!isFormValid || isSubmitting}
				className="min-h-13 w-full rounded-xl bg-gradient-to-r from-violet-400 to-violet-600 px-6 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
			>
				{isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
			</button>
		</form>
	);
}
