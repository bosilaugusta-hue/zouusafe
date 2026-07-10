import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef4ff] via-[#f6efff] to-[#fff5e6] px-6 py-12">
      <Image
        src="/clouds-bg.png"
        alt=""
        fill
        priority
        className="-z-10 object-cover opacity-25"
      />

      <Image
        src="/kids.png"
        alt="Enfants explorateurs ZouuSafe"
        width={430}
        height={430}
        className="float absolute bottom-8 left-8 hidden drop-shadow-2xl xl:block"
      />

      <Image
        src="/robot.png"
        alt="Robot assistant ZouuSafe"
        width={250}
        height={250}
        className="float absolute right-20 top-40 hidden drop-shadow-2xl xl:block"
      />

      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">
        <Link href="/" aria-label="Retour à l’accueil">
          <Image
            src="/renard.png"
            alt="Logo ZouuSafe"
            width={150}
            height={70}
            priority
            className="mx-auto mb-5"
          />
        </Link>

        <header className="text-center">
          <h1 className="text-3xl font-black text-slate-900">
            Créer un compte parent
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Commencez à protéger les découvertes de votre enfant.
          </p>
        </header>

        <form className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Prénom
            </span>

            <input
              type="text"
              name="firstName"
              autoComplete="given-name"
              placeholder="Votre prénom"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Nom
            </span>

            <input
              type="text"
              name="lastName"
              autoComplete="family-name"
              placeholder="Votre nom"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Adresse email
            </span>

            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="exemple@email.com"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Mot de passe
            </span>

            <input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="12 caractères minimum"
              minLength={12}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Créer mon compte
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Déjà inscrit ?{" "}
          <Link
            href="/login"
            className="font-bold text-violet-600 hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </section>
    </main>
  );
}