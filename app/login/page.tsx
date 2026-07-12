import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <Image
        src="/clouds-bg.png"
        alt=""
        fill
        priority
        className="-z-20 object-cover"
      />

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/10 via-pink-300/10 to-orange-200/10" />

      <Image
        src="/Bonjour_renard.png"
        alt="Renard ZouuSafe"
        width={350}
        height={350}
        className="float absolute bottom-0 left-4 hidden h-auto w-[280px] drop-shadow-2xl xl:block"
      />

      <Image
        src="/Bonjour_robot.png"
        alt="Robot protecteur ZouuSafe"
        width={300}
        height={350}
        className="float absolute right-8 top-24 hidden h-auto w-[250px] drop-shadow-2xl xl:block"
      />

      <p className="absolute right-52 top-40 hidden rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-violet-700 shadow-lg xl:block">
        👋 Bonjour Parent !
      </p>

      <section className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">
        <Link href="/">
          <Image
            src="/Renard_logo.png"
            alt="Logo ZouuSafe"
            width={250}
            height={100}
            priority
            className="mx-auto mb-4 h-auto w-[220px]"
          />
        </Link>

        <header className="text-center">
          <h1 className="text-4xl font-black text-slate-900">
            Connexion parent
          </h1>

          <p className="mt-3 text-slate-600">
            Retrouvez l’activité de votre enfant et ses paramètres de sécurité.
          </p>
        </header>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-slate-600">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-bold text-violet-600 hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </section>

      <p className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-sm font-semibold text-slate-700 md:block">
        🛡️ ZouuSafe protège les explorations numériques de vos enfants.
      </p>
    </main>
  );
}