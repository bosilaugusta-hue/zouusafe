"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#dbeafe] via-[#e9d5ff] to-[#fde68a]" />

      <Image
        src="/clouds-bg.png"
        alt="bg"
        fill
        priority
        className="object-cover opacity-40 -z-10"
      />

      {/* 🔥 NAVBAR PREMIUM */}
      <header
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-12 py-4 transition-all duration-300 ${scrolled ? "navbar-scrolled" : "bg-transparent"
          }`}
      >
        {/* LOGO */}
        <Image
          src="/renard.png"
          alt="logo"
          width={220}
          height={100}
          priority
          className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:scale-105 transition"
        />

        {/* NAV */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <a className="hover:text-black" href="#">À propos</a>
          <a className="hover:text-black" href="#">Contrôle Parental</a>
          <button className="bg-gradient-to-r from-green-400 to-green-500 text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition">
            Pour Parents
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative flex flex-col items-center text-center pt-40 pb-28">

        {/* 👧 */}
        <div className="absolute left-24 top-48 hidden md:block">
          <Image
            src="/girl.png"
            alt="girl"
            width={260}
            height={260}
            className="drop-shadow-2xl float"
          />
        </div>

        {/* 🤖 */}
        <div className="absolute right-28 top-40 hidden md:block">
          <Image
            src="/robot.png"
            alt="robot"
            width={220}
            height={220}
            className="drop-shadow-2xl float"
          />
        </div>

        <h1 className="text-5xl font-bold mb-6 leading-tight text-gray-800">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Explore internet
          </span>
          <br />
          en toute sécurité
        </h1>

        {/* SEARCH */}
        <div className="bg-white/80 backdrop-blur-md rounded-full shadow-xl px-6 py-3 flex items-center w-full max-w-xl border border-white/50">
          <input
            className="flex-1 outline-none bg-transparent"
            placeholder="Que veux-tu chercher ?"
          />
          <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-5 py-2 rounded-full hover:scale-105 transition">
            🔍
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-700">
          ✅ Recherche sécurisée validée pour les enfants
        </p>
      </section>

      {/* CONTENT */}
      <section className="px-10 grid md:grid-cols-2 gap-8">

        {/* LEFT */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-8 border border-white/50 shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition">

          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold">Petits Explorateurs</h2>
            <span className="bg-yellow-200 px-3 py-1 rounded-full text-xs">
              3-7 ans
            </span>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="bg-yellow-100 p-4 rounded-xl flex-1 text-center hover:scale-110 transition">
              🐾 Animaux
            </div>
            <div className="bg-green-100 p-4 rounded-xl flex-1 text-center hover:scale-110 transition">
              💡 Apprendre
            </div>
            <div className="bg-blue-100 p-4 rounded-xl flex-1 text-center hover:scale-110 transition">
              ▶️ Vidéos
            </div>
          </div>

          <button className="w-full bg-gray-200 py-3 rounded-xl mb-6">
            Démarrer Recherches
          </button>

          <div className="flex justify-center">
            <Image src="/kids.png" alt="kids" width={420} height={420} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-8 border border-white/50 shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition">

          <h2 className="font-semibold mb-3">
            Qu'est-ce qu'un <span className="text-blue-600">dinosaure</span> ?
          </h2>

          <Image
            src="/dino.png"
            alt="dino"
            width={520}
            height={260}
            className="rounded-xl mb-4"
          />

          <p className="text-sm text-gray-600 mb-4">
            Les dinosaures étaient des très grands animaux qui vivaient il y a très longtemps !
          </p>

          <button className="bg-white shadow px-4 py-2 rounded-lg">
            En savoir plus →
          </button>
        </div>
      </section>

      {/* SECURITY */}
      <section className="px-10 mt-14">
        <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/50 flex items-center gap-4">
          <Image src="/renard-shield.png" alt="shield" width={80} height={80} />
          <div>
            <h3 className="font-semibold">Recherche 100% sécurisée</h3>
            <p className="text-sm text-gray-600">
              Toutes les recherches sont filtrées pour protéger les enfants.
            </p>
          </div>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-600 mt-14 pb-6">
        ZouuSafe © 2024
      </footer>
    </main>
  );
}