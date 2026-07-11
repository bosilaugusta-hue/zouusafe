import Image from "next/image";
import Link from "next/link";

export default function NewChildPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] px-6 py-10">
      <section className="mx-auto max-w-3xl rounded-3xl bg-white/90 p-8 shadow-xl">
        <Link
          href="/parent-dashboard"
          className="text-sm font-bold text-violet-600 hover:underline"
        >
          ← Retour au dashboard
        </Link>

        <header className="mt-6 text-center">
          <Image
            src="/Robot_zen.png"
            alt="Robot ZouuSafe"
            width={150}
            height={150}
            className="mx-auto"
          />

          <h1 className="mt-4 text-3xl font-black text-slate-900">
            Ajouter un enfant
          </h1>

          <p className="mt-2 text-slate-600">
            Créez un profil adapté à son âge et à ses besoins.
          </p>
        </header>

        <form className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Prénom
            </span>

            <input
              type="text"
              name="firstName"
              placeholder="Prénom de l’enfant"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
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
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Avatar
            </span>

            <select
              name="avatar"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              <option value="zoe.png">Avatar Zoé</option>
              <option value="Fille_tablette.png">Fille tablette</option>
              <option value="kids.png">Explorateur</option>
            </select>
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-violet-400 to-violet-600 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5"
          >
            Ajouter l’enfant
          </button>
        </form>
      </section>
    </main>
  );
}