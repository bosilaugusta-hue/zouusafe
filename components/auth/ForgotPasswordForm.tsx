"use client";

import { Mail } from "lucide-react";
import { type FormEvent, useState } from "react";

type ForgotPasswordResponse = {
  message?: string;
};

export default function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = (await response.json()) as ForgotPasswordResponse;

      if (!response.ok) {
        setError(
          result.message ??
            "Impossible de traiter votre demande pour le moment.",
        );
        return;
      }

      setMessage(
        result.message ??
          "Si un compte correspond à cette adresse, un lien de réinitialisation a été envoyé.",
      );

      event.currentTarget.reset();
    } catch (error) {
      console.error("Erreur mot de passe oublié :", error);

      setError(
        "Impossible de contacter le serveur. Veuillez réessayer dans quelques instants.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-700">
          Adresse email
        </span>

        <span className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
          <Mail
            size={19}
            aria-hidden="true"
            className="shrink-0 text-violet-500"
          />

          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="exemple@email.com"
            required
            className="w-full bg-transparent py-3.5 outline-none"
          />
        </span>
      </label>

      {error && (
        <p
          role="alert"
          className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
        >
          {error}
        </p>
      )}

      {message && (
        <p
          role="status"
          className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-3xl bg-gradient-to-r from-violet-400 to-violet-600 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading
          ? "Envoi en cours..."
          : "Envoyer le lien de réinitialisation"}
      </button>
    </form>
  );
}