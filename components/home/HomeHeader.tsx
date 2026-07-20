"use client";

import { ArrowRight, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomeHeader() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		function handleScroll() {
			setScrolled(window.scrollY > 20);
		}

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
				scrolled
					? "bg-white/95 shadow-lg backdrop-blur-xl"
					: "bg-white/85 backdrop-blur-md"
			}`}
		>
			<section className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-3 md:px-10">
				<Link href="/" aria-label="Accueil ZouuSafe">
					<Image
						src="/logos/Renard-logo.png"
						alt="Logo ZouuSafe"
						width={230}
						height={90}
						priority
						className="h-auto w-[160px] md:w-[205px]"
					/>
				</Link>

				<nav className="hidden items-center gap-8 text-sm font-bold text-slate-700 lg:flex">
					<a
						href="#home"
						className="border-b-2 border-violet-500 pb-2 text-violet-600"
					>
						Accueil
					</a>

					<a href="#features" className="transition hover:text-violet-600">
						Fonctionnalités
					</a>

					<a href="#steps" className="transition hover:text-violet-600">
						Comment ça marche
					</a>

					<a href="#about" className="transition hover:text-violet-600">
						À propos
					</a>
				</nav>

				<Link
					href="/login"
					className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl md:px-6"
				>
					<UserRound size={17} />
					<span className="hidden sm:inline">Connexion parent</span>
					<ArrowRight size={17} />
				</Link>
			</section>
		</header>
	);
}
