import ChildForm from "@/components/children/ChildForm";
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

        <ChildForm />
      </section>
    </main>
  );
}