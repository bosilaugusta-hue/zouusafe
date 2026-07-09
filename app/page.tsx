"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Clock,
  LayoutDashboard,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

const features = [
  {
    title: "Recherche sécurisée",
    text: "Tous les contenus sensibles sont filtrés avant d’être affichés.",
    icon: ShieldCheck,
    color: "border-violet-400 bg-violet-50 text-violet-600",
  },
  {
    title: "Dashboard parent",
    text: "Suivez l’activité de votre enfant en temps réel.",
    icon: LayoutDashboard,
    color: "border-blue-400 bg-blue-50 text-blue-600",
  },
  {
    title: "Temps d’écran",
    text: "Fixez des limites et gérez le temps d’utilisation facilement.",
    icon: Clock,
    color: "border-green-400 bg-green-50 text-green-600",
  },
  {
    title: "Alertes intelligentes",
    text: "Soyez informé si un contenu est bloqué.",
    icon: Bell,
    color: "border-orange-400 bg-orange-50 text-orange-600",
  },
];

const steps = [
  {
    number: "1",
    title: "Le parent crée un compte",
    text: "Inscription rapide et sécurisée.",
    icon: UserRound,
  },
  {
    number: "2",
    title: "Il ajoute son enfant",
    text: "Un profil adapté à son âge est créé.",
    icon: UserRound,
  },
  {
    number: "3",
    title: "L’enfant explore",
    text: "Il effectue ses recherches en toute sécurité.",
    icon: Search,
  },
  {
    number: "4",
    title: "ZouuSafe protège",
    text: "Les contenus dangereux sont filtrés et signalés.",
    icon: ShieldCheck,
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
    <main className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#eaf2ff] via-[#f7efff] to-[#fff1d6]">
        <Image
          src="/clouds-bg.png"
          alt="Ciel pastel avec des nuages doux"
          fill
          priority
          className="-z-0 object-cover opacity-35"
        />

        <header
          className={`fixed left-0 top-0 z-50 flex w-full items-center justify-between px-6 py-4 transition-all duration-300 md:px-14 ${
            scrolled ? "navbar-scrolled" : "bg-white/75 backdrop-blur-xl"
          }`}
        >
          <Image
            src="/renard.png"
            alt="Logo ZouuSafe"
            width={210}
            height={90}
            priority
          />

          <nav className="hidden items-center gap-8 text-sm font-black text-slate-700 md:flex">
            <a href="#features" className="hover:text-violet-600">
              Fonctionnalités
            </a>

            <a href="#steps" className="hover:text-violet-600">
              Comment ça marche
            </a>

            <Link
              href="/login"
              className="rounded-xl bg-violet-600 px-6 py-4 text-white shadow-lg transition hover:scale-105"
            >
              Connexion parent
            </Link>
          </nav>
        </header>

        <section className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-28 text-center">
          <Image
            src="/Fille_tablette.png"
            alt="Enfant utilisant une tablette"
            width={380}
            height={380}
            className="float absolute left-14 top-56 hidden drop-shadow-2xl xl:block"
          />

          <Image
            src="/robot.png"
            alt="Robot assistant ZouuSafe"
            width={270}
            height={270}
            className="float absolute right-24 top-52 hidden drop-shadow-2xl xl:block"
          />

          <section className="max-w-3xl">
            <p className="mx-auto mb-5 w-fit rounded-full border border-violet-200 bg-white/70 px-5 py-2 text-sm font-black text-violet-600 shadow-sm">
              🛡️ Le copilote numérique des familles
            </p>

            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              Internet sécurisé
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                pour les enfants
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-slate-700 md:text-lg">
              Un moteur de recherche sécurisé avec contrôle parental. Pour que
              vos enfants explorent, apprennent et grandissent en toute
              sérénité.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-9 py-4 font-black text-white shadow-xl transition hover:scale-105"
              >
                Créer un compte
              </Link>

              <a
                href="#features"
                className="rounded-xl border border-violet-300 bg-white px-9 py-4 font-black text-slate-800 shadow-xl transition hover:scale-105"
              >
                Découvrir ZouuSafe
              </a>
            </div>
          </section>
        </section>
      </section>

      <section id="features" className="px-6 py-16 md:px-14">
        <section className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className={`rounded-2xl border-t-4 bg-white p-7 shadow-xl ${feature.color}`}
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Icon size={30} />
                </span>

                <h2 className="mt-6 text-2xl font-black text-slate-900">
                  {feature.title}
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {feature.text}
                </p>

                <span className="mt-6 inline-block text-2xl font-black">
                  →
                </span>
              </article>
            );
          })}
        </section>
      </section>

      <section id="steps" className="px-6 py-10 md:px-14">
        <h2 className="text-center text-4xl font-black">
          Comment fonctionne ZouuSafe ?
        </h2>

        <section className="mx-auto mt-12 grid max-w-7xl gap-8 md:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="relative rounded-2xl bg-white p-6 text-center shadow-lg"
              >
                <span className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-violet-600 text-sm font-black text-white">
                  {step.number}
                </span>

                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                  <Icon size={34} />
                </span>

                <h3 className="mt-5 font-black">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.text}
                </p>
              </article>
            );
          })}
        </section>
      </section>

      <section className="px-6 py-20 md:px-14">
        <section className="mx-auto grid max-w-7xl gap-10 rounded-3xl bg-violet-50 p-8 shadow-xl lg:grid-cols-[0.8fr_1.2fr]">
          <article>
            <h2 className="text-4xl font-black">
              Découvrez votre espace parent
            </h2>

            <p className="mt-5 max-w-md leading-7 text-slate-600">
              Un tableau de bord simple pour garder le contrôle et accompagner
              votre enfant au quotidien.
            </p>

            <ul className="mt-8 space-y-4 text-sm font-bold text-slate-700">
              <li>✅ Activité en temps réel</li>
              <li>✅ Statistiques claires</li>
              <li>✅ Gestion facile et rapide</li>
            </ul>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="grid gap-4 md:grid-cols-3">
              <section className="rounded-2xl bg-violet-50 p-4">
                <p className="text-sm text-slate-500">Recherches</p>
                <strong className="text-3xl">12</strong>
              </section>

              <section className="rounded-2xl bg-green-50 p-4">
                <p className="text-sm text-slate-500">Temps d’écran</p>
                <strong className="text-3xl">1h25</strong>
              </section>

              <section className="rounded-2xl bg-red-50 p-4">
                <p className="text-sm text-slate-500">Alertes</p>
                <strong className="text-3xl">2</strong>
              </section>
            </div>

            <section className="mt-5 rounded-2xl border border-slate-100 p-5">
              <p className="font-black">Activité récente</p>
              <p className="mt-3 text-sm text-slate-600">
                Zoé a recherché : “dinosaures”
              </p>
              <p className="mt-2 text-sm text-green-600">
                Recherche autorisée
              </p>
            </section>
          </article>
        </section>
      </section>

      <section className="border-t border-slate-100 px-6 py-10 md:px-14">
        <section className="mx-auto grid max-w-7xl gap-6 text-center md:grid-cols-3">
          <p className="font-bold">🛡️ 100% sécurisé</p>
          <p className="font-bold">💗 Conçu pour les enfants</p>
          <p className="font-bold">🔐 Contrôle total pour les parents</p>
        </section>
      </section>

      <footer className="bg-violet-600 px-6 py-6 text-center text-sm font-bold text-white">
        ZouuSafe © 2026 · Tous droits réservés
      </footer>
    </main>
  );
}