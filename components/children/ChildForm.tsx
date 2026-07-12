"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

const avatars: string[] = [
  ...Array.from(
    { length: 15 },
    (_, index) => `/avatars_profil/fille_${index + 1}.png`,
  ),
  ...Array.from(
    { length: 15 },
    (_, index) => `/avatars_profil/garcon_${index + 16}.png`,
  ),
];

export default function ChildForm() {
  const router = useRouter();

  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const firstName = String(formData.get("firstName") ?? "").trim();
    const birthDate = String(formData.get("birthDate") ?? "");

    try {
      const response = await fetch("/api/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          birthDate,
          avatar: selectedAvatar,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Impossible d’ajouter l’enfant.");
      }

      router.push("/parent-dashboard");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-700">
          Prénom
        </span>

        <input
          type="text"
          name="firstName"
          placeholder="Prénom de l’enfant"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-700">
          Date de naissance
        </span>

        <input
          type="date"
          name="birthDate"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
        />
      </label>

      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-700">
          Choisir un avatar
        </h2>

        <div className="mb-5 flex items-center gap-4 rounded-2xl bg-violet-50 p-4">
         <Image
  src={selectedAvatar}
  alt="Avatar sélectionné"
  width={90}
  height={90}
  unoptimized
  className="h-20 w-20 rounded-full border-4 border-white object-contain shadow-md"
/>

          <div>
            <p className="font-black text-violet-700">Avatar sélectionné</p>

            <p className="mt-1 text-sm text-slate-600">
              Cliquez sur une image pour la choisir.
            </p>
          </div>
        </div>

        <div className="grid max-h-80 grid-cols-4 gap-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-5 md:grid-cols-6">
          {avatars.map((avatar, index) => {
            const isSelected = avatar === selectedAvatar;

            return (
              <button
                key={avatar}
                type="button"
                aria-label={`Choisir l’avatar ${index + 1}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedAvatar(avatar)}
                className={`relative aspect-square overflow-hidden rounded-2xl border-4 transition hover:-translate-y-1 hover:shadow-lg ${
                  isSelected
                    ? "border-violet-500 bg-violet-100 shadow-lg"
                    : "border-transparent bg-slate-50"
                }`}
              >
                <Image
  src={avatar}
  alt={`Avatar ${index + 1}`}
  fill
  unoptimized
  sizes="100px"
  className="object-contain"
/>

                {isSelected && (
                  <span className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-black text-white shadow">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {error && (
        <p
          role="alert"
          className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-gradient-to-r from-violet-400 to-violet-600 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Ajout en cours..." : "Ajouter l’enfant"}
      </button>
    </form>
  );
}