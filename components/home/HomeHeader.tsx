"use client";

import { ArrowRight, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomeHeader() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		function handleScroll() {
			setScrolled(window.scrollY > 15);
		}

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
				scrolled
					? "border-b border-white/70 bg-white/85 shadow-xl backdrop-blur-xl"
					: "bg-white/55 backdrop-blur-xl"
			}`}
		>
			<div className="mx-auto flex h-[90px] max-w-[1500px] items-center justify-between px-8 lg:px-12">
				<Link
					href="/"
					aria-label="Accueil ZouuSafe"
					className="transition hover:scale-[1.02]"
				>
					<Image
						src="/logos/Renard-logo.png"
						alt="Logo ZouuSafe"
						width={280}
						height={100}
						priority
						className="h-auto w-[210px] xl:w-[250px]"
					/>
				</Link>

				<nav className="hidden items-center gap-10 lg:flex">
					<a
						href="#home"
						className="border-b-2 border-violet-600 pb-1 text-sm font-bold text-violet-600"
					>
						Accueil
					</a>

					<a
						href="#features"
						className="text-sm font-semibold text-slate-700 transition hover:text-violet-600"
					>
						Fonctionnalités
					</a>

					<a
						href="#steps"
						className="text-sm font-semibold text-slate-700 transition hover:text-violet-600"
					>
						Comment ça marche
					</a>

					<a
						href="#about"
						className="text-sm font-semibold text-slate-700 transition hover:text-violet-600"
					>
						À propos
					</a>
				</nav>

				<Link href="/login" className="btn-primary">
					<UserRound size={18} />

					<span className="hidden sm:inline">Connexion parent</span>

					<ArrowRight size={18} />
				</Link>
			</div>
		</header>
	);
}
