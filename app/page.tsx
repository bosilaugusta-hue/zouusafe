"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const features = [
  {
    title: "Recherche sécurisée",
    description:
      "Les contenus inadaptés sont filtrés avant d’être affichés aux enfants.",
    image: "/Renard_detective.png",
    background: "bg-violet-50",
  },
  {
    title: "Temps d’écran maîtrisé",
    description:
      "Définissez une limite adaptée au rythme et à l’âge de votre enfant.",
    image: "/Renard_chronometre.png",
    background: "bg-blue-50",
  },
  {
    title: "Alertes intelligentes",
    description:
      "Recevez une alerte lorsqu’une activité nécessite votre attention.",
    image: "/Renard_cloche.png",
    background: "bg-orange-50",
  },
  {
    title: "Validation parentale",
    description:
      "Gardez le contrôle des paramètres et des autorisations de navigation.",
    image: "/Renard_telephone.png",
    background: "bg-green-50",
  },
  {
    title: "Apprendre en confiance",
    description:
      "Les enfants découvrent internet dans un environnement adapté à leur âge.",
    image: "/Renard_ordinateur.png",
    background: "bg-pink-50",
  },
  {
    title: "Protection active",
    description:
      "Zouu accompagne chaque exploration pour rendre la navigation plus sûre.",
    image: "/Robot_protecteur.png",
    background: "bg-cyan-50",
  },
];

const steps = [
  {
    number: "1",
    title: "Le parent crée un compte",
    description: "Il s’inscrit depuis l’espace parent sécurisé.",
  },
  {
    number: "2",
    title: "Il ajoute son enfant",
    description: "Il crée un profil adapté à son âge et à ses besoins.",
  },
  {
    number: "3",
    title: "L’enfant explore",
    description: "Il effectue ses recherches dans son espace sécurisé.",
  },
  {
    number: "4",
    title: "ZouuSafe protège",
    description: "Les contenus sensibles sont filtrés et signalés au parent.",
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfbff] text-slate-900">
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff4e5]">
        <Image
          src="/clouds-bg.png"
          alt=""
          fill
          priority
          className="object-cover opacity-30"
        />

        <header
          className={`fixed left-0 top-0 z-50 flex w-full items-center justify-between px-6 py-4 transition-all duration-300 md:px-14 ${
            scrolled
              ? "bg-white/95 shadow-lg backdrop-blur-xl"
              : "bg-white/75 backdrop-blur-md"
          }`}
        >
          <Link href="/" aria-label="Accueil ZouuSafe">
            <Image
              src="/Renard_logo.png"
              alt="Logo ZouuSafe"
              width={220}
              height={90}
              priority
              className="h-auto w-[170px] md:w-[220px]"
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 md:flex">
            <a
              href="#features"
              className="transition hover:text-violet-600"
            >
              Fonctionnalités
            </a>

            <a href="#steps" className="transition hover:text-violet-600">
              Comment ça marche
            </a>

            <a href="#parent-space" className="transition hover:text-violet-600">
              Espace parent
            </a>

            <Link
              href="/login"
              className="rounded-2xl bg-gradient-to-r from-violet-400 to-violet-600 px-6 py-3 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Connexion parent
            </Link>
          </nav>

          <Link
            href="/login"
            className="rounded-xl bg-gradient-to-r from-violet-400 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md md:hidden"
          >
            Connexion
          </Link>
        </header>

        <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 pb-20 pt-32 text-center">
          <Image
            src="/Fille_tablette.png"
            alt="Petite fille utilisant une tablette"
            width={400}
            height={540}
            className="float absolute bottom-14 left-4 hidden h-auto w-[310px] drop-shadow-2xl xl:block"
          />

          <Image
            src="/Robot_protecteur.png"
            alt="Robot protecteur ZouuSafe"
            width={350}
            height={470}
            className="float absolute bottom-16 right-10 hidden h-auto w-[290px] drop-shadow-2xl xl:block"
          />

          <section className="max-w-3xl">
            <p className="mx-auto mb-5 w-fit rounded-full border border-violet-200 bg-white/85 px-5 py-2 text-sm font-bold text-violet-600 shadow-sm">
              🛡️ Le copilote numérique des familles
            </p>

            <h1 className="text-5xl font-black leading-[1.08] md:text-7xl">
              Internet sécurisé
              <br />

              <span className="bg-gradient-to-r from-violet-500 via-pink-400 to-blue-500 bg-clip-text text-transparent">
                pour les enfants
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-700 md:text-lg">
              Un moteur de recherche sécurisé avec contrôle parental, conçu
              pour que les enfants explorent, apprennent et grandissent en
              toute sérénité.
            </p>

            <section className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-2xl bg-gradient-to-r from-violet-400 to-violet-600 px-9 py-4 font-bold text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
              >
                Créer un compte
              </Link>

              <a
                href="#features"
                className="rounded-2xl border border-violet-300 bg-white/90 px-9 py-4 font-bold text-violet-700 shadow-lg transition hover:-translate-y-1 hover:bg-violet-50"
              >
                Découvrir ZouuSafe
              </a>
            </section>

            <section className="mt-7 flex flex-wrap justify-center gap-5 text-sm font-semibold text-slate-600">
              <span>✓ Sans publicité</span>
              <span>✓ Filtres intelligents</span>
              <span>✓ Contrôle parental</span>
            </section>
          </section>
        </section>
      </section>

      <section id="features" className="px-6 py-20 md:px-14">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <p className="font-bold text-violet-600">
            Les super-pouvoirs de Zouu
          </p>

          <h2 className="mt-3 text-3xl font-black md:text-4xl">
            Une protection pensée pour toute la famille
          </h2>

          <p className="mt-4 text-slate-600">
            Les enfants découvrent internet sereinement pendant que les parents
            gardent le contrôle.
          </p>
        </header>

        <section className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <section
                className={`flex min-h-[200px] items-center justify-center rounded-2xl ${feature.background}`}
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={210}
                  height={210}
                  className="h-[180px] w-auto object-contain"
                />
              </section>

              <h3 className="mt-6 text-xl font-black">{feature.title}</h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </section>
      </section>

      <section
        id="steps"
        className="bg-gradient-to-br from-violet-50 via-blue-50 to-orange-50 px-6 py-20 md:px-14"
      >
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-bold text-violet-600">Simple et rassurant</p>

          <h2 className="mt-3 text-3xl font-black md:text-4xl">
            Comment fonctionne ZouuSafe ?
          </h2>
        </header>

        <section className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.number}
              className="relative rounded-3xl bg-white p-7 shadow-lg"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 text-lg font-black text-white shadow-md">
                {step.number}
              </span>

              <h3 className="mt-6 text-lg font-black">{step.title}</h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </article>
          ))}
        </section>

        <Image
          src="/kids.png"
          alt="Groupe d’enfants explorateurs"
          width={650}
          height={430}
          className="mx-auto mt-12 h-auto w-full max-w-[620px] object-contain"
        />
      </section>

      <section id="parent-space" className="px-6 py-20 md:px-14">
        <section className="mx-auto grid max-w-7xl items-center gap-12 rounded-[2rem] bg-[#f3efff] p-8 shadow-xl lg:grid-cols-[0.8fr_1.2fr] lg:p-12">
          <article>
            <p className="font-bold text-violet-600">Espace parent</p>

            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Gardez un œil sur les découvertes de votre enfant
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Consultez les recherches, les alertes, les appareils connectés et
              le temps d’écran depuis un tableau de bord simple et agréable.
            </p>

            <ul className="mt-7 space-y-3 text-sm font-semibold text-slate-700">
              <li>✓ Historique des recherches</li>
              <li>✓ Alertes de sécurité</li>
              <li>✓ Limites de temps</li>
              <li>✓ Gestion des appareils</li>
            </ul>

            <Link
              href="/register"
              className="mt-8 inline-block rounded-2xl bg-gradient-to-r from-violet-400 to-violet-600 px-7 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Découvrir l’espace parent
            </Link>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-lg">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <section>
                <p className="text-sm text-slate-500">Tableau de bord</p>

                <h3 className="text-2xl font-black">
                  Bonjour, Parent <span className="wave">👋</span>
                </h3>
              </section>

              <span className="rounded-xl bg-green-100 px-3 py-2 text-sm font-bold text-green-700">
                Protection active
              </span>
            </header>

            <section className="mt-6 grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl bg-violet-50 p-4">
                <p className="text-sm text-slate-500">Recherches</p>
                <strong className="text-3xl">12</strong>
              </article>

              <article className="rounded-2xl bg-blue-50 p-4">
                <p className="text-sm text-slate-500">Temps d’écran</p>
                <strong className="text-3xl">1h25</strong>
              </article>

              <article className="rounded-2xl bg-orange-50 p-4">
                <p className="text-sm text-slate-500">Alertes</p>
                <strong className="text-3xl">2</strong>
              </article>
            </section>

            <section className="mt-5 rounded-2xl border border-slate-100 p-5">
              <p className="font-black">Activité récente</p>

              <p className="mt-3 text-sm text-slate-600">
                Zoé a recherché : « dinosaures »
              </p>

              <p className="mt-2 text-sm font-semibold text-green-600">
                Recherche autorisée
              </p>
            </section>
          </article>
        </section>
      </section>

      <section className="px-6 pb-20 md:px-14">
        <section className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-violet-400 to-violet-600 p-8 text-center text-white shadow-xl md:flex-row md:text-left">
          <section>
            <h2 className="text-3xl font-black">
              Prêt à offrir un internet plus sûr à vos enfants ?
            </h2>

            <p className="mt-2 text-violet-100">
              Créez votre espace parent et commencez à protéger leurs
              découvertes.
            </p>
          </section>

          <Link
            href="/register"
            className="rounded-2xl bg-white px-7 py-4 font-bold text-violet-700 shadow-lg transition hover:-translate-y-0.5"
          >
            Créer mon compte
          </Link>
        </section>
      </section>

      <footer className="border-t border-slate-100 bg-white px-6 py-8 md:px-14">
        <section className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
          <Image
            src="/Renard_logo.png"
            alt="Logo ZouuSafe"
            width={170}
            height={70}
          />

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <a href="#features" className="hover:text-violet-600">
              Fonctionnalités
            </a>

            <a href="#steps" className="hover:text-violet-600">
              Comment ça marche
            </a>

            <Link href="/login" className="hover:text-violet-600">
              Connexion parent
            </Link>
          </nav>

          <p className="text-sm text-slate-500">ZouuSafe © 2026</p>
        </section>
      </footer>
    </main>
  );
}