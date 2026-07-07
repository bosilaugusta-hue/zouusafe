"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#dbeafe] via-[#e9d5ff] to-[#fde68a]" />

      <Image
        src="/clouds-bg.png"
        alt="Ciel pastel avec des nuages doux"
        fill
        priority
        className="-z-10 object-cover opacity-40"
      />

      <header
        className={`fixed left-0 top-0 z-50 flex w-full items-center justify-between px-6 py-4 transition-all duration-300 md:px-12 ${
          scrolled ? "navbar-scrolled" : "bg-transparent"
        }`}
      >
        <Image
          src="/renard.png"
          alt="Logo ZouuSafe avec un renard protecteur"
          width={220}
          height={100}
          priority
          className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition hover:scale-105"
        />

        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-700 md:flex">
          <a className="hover:text-black" href="#about">
            À propos
          </a>

          <a className="hover:text-black" href="#security">
            Contrôle parental
          </a>

          <Link
            href="/login"
            className="rounded-full bg-gradient-to-r from-green-400 to-green-500 px-5 py-2 text-white shadow-md transition hover:scale-105"
          >
            Pour Parents
          </Link>
        </nav>
      </header>

      <section className="relative flex flex-col items-center px-6 pb-20 pt-40 text-center md:pb-28">
        <div className="absolute left-24 top-48 hidden md:block">
          <Image
            src="/girl.png"
            alt="Enfant qui utilise une tablette en sécurité"
            width={360}
            height={360}
            className="float drop-shadow-2xl"
          />
        </div>

        <div className="absolute right-28 top-40 hidden md:block">
          <Image
            src="/robot.png"
            alt="Petit robot assistant qui accompagne les enfants"
            width={220}
            height={220}
            className="float drop-shadow-2xl"
          />
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-800 md:text-5xl">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Explore internet
          </span>
          <br />
          en toute sécurité
        </h1>

        <p className="mb-8 max-w-xl text-sm text-gray-700 md:text-base">
          ZouuSafe aide les enfants à découvrir internet dans un environnement
          simple, rassurant et contrôlé par les parents.
        </p>

        <div className="flex w-full max-w-xl items-center rounded-full border border-white/50 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-md md:px-6">
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            placeholder="Que veux-tu chercher ?"
          />

          <button
            type="button"
            className="rounded-full bg-gradient-to-r from-blue-400 to-blue-600 px-5 py-2 text-white transition hover:scale-105"
          >
            🔍
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-700">
          ✅ Recherche sécurisée validée pour les enfants
        </p>
      </section>

      <section className="grid gap-8 px-6 md:grid-cols-2 md:px-10">
        <div
          id="about"
          className="rounded-3xl border border-white/50 bg-white/60 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
        >
          <div className="mb-6 flex justify-between">
            <h2 className="text-xl font-semibold">Petits Explorateurs</h2>

            <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs">
              3-7 ans
            </span>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <button
              type="button"
              className="rounded-xl bg-yellow-100 p-4 text-center transition hover:scale-105"
            >
              🐾 Animaux
            </button>

            <button
              type="button"
              className="rounded-xl bg-green-100 p-4 text-center transition hover:scale-105"
            >
              💡 Apprendre
            </button>

            <button
              type="button"
              className="rounded-xl bg-blue-100 p-4 text-center transition hover:scale-105"
            >
              ▶️ Vidéos
            </button>
          </div>

          <button
            type="button"
            className="mb-6 w-full rounded-xl bg-gray-200 py-3 transition hover:bg-gray-300"
          >
            Démarrer la recherche
          </button>

          <div className="flex justify-center">
            <Image
              src="/kids.png"
              alt="Groupe d'enfants qui découvrent internet"
              width={420}
              height={420}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/50 bg-white/60 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
          <h2 className="mb-3 font-semibold">
            Qu'est-ce qu'un <span className="text-blue-600">dinosaure</span> ?
          </h2>

          <Image
            src="/dino.png"
            alt="Dinosaures dans un paysage naturel"
            width={520}
            height={260}
            className="mb-4 rounded-xl"
          />

          <p className="mb-4 text-sm text-gray-600">
            Les dinosaures étaient de très grands animaux qui vivaient il y a
            très longtemps.
          </p>

          <button
            type="button"
            className="rounded-lg bg-white px-4 py-2 shadow transition hover:scale-105"
          >
            En savoir plus →
          </button>
        </div>
      </section>

      <section id="security" className="mt-14 px-6 md:px-10">
        <div className="flex items-center gap-4 rounded-3xl border border-white/50 bg-white/60 p-6 backdrop-blur-2xl">
          <Image
            src="/renard-shield.png"
            alt="Renard protecteur avec un bouclier"
            width={80}
            height={80}
          />

          <div>
            <h3 className="font-semibold">Recherche 100% sécurisée</h3>

            <p className="text-sm text-gray-600">
              Les recherches sont filtrées pour protéger les enfants et
              rassurer les parents.
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-14 pb-6 text-center text-sm text-gray-600">
        ZouuSafe © 2026
      </footer>
    </main>
  );
}