import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function HomeFooter() {
	return (
		<footer className="border-t border-slate-100 bg-white px-8 py-16 md:px-12">
			<section className="mx-auto grid max-w-[1750px] gap-12 sm:grid-cols-2 lg:grid-cols-5">
				<article>
					<Image
						src="/logos/Renard-logo.png"
						alt="Logo ZouuSafe"
						width={210}
						height={90}
						className="h-auto w-[190px]"
					/>

					<p className="mt-5 max-w-[270px] text-sm leading-7 text-slate-500">
						Le moteur de recherche sécurisé pour les enfants et le copilote
						numérique des parents.
					</p>
				</article>

				<FooterColumn
					title="ZouuSafe"
					links={[
						{ label: "Accueil", href: "#home" },
						{ label: "Fonctionnalités", href: "#features" },
						{ label: "Comment ça marche", href: "#steps" },
						{ label: "À propos", href: "#about" },
					]}
				/>

				<FooterColumn
					title="Aide"
					links={[
						{ label: "Guide parent", href: "#" },
						{ label: "Questions fréquentes", href: "#" },
						{ label: "Sécurité", href: "#" },
						{ label: "Nous contacter", href: "#" },
					]}
				/>

				<FooterColumn
					title="Légal"
					links={[
						{ label: "Confidentialité", href: "#" },
						{ label: "Conditions d’utilisation", href: "#" },
						{ label: "Mentions légales", href: "#" },
					]}
				/>

				<article>
					<h3 className="text-lg font-black text-slate-900">Suivez-nous</h3>

					<div className="mt-5 flex gap-3">
						<SocialIcon label="Facebook">
							<FaFacebookF size={18} />
						</SocialIcon>

						<SocialIcon label="Instagram">
							<FaInstagram size={18} />
						</SocialIcon>

						<SocialIcon label="YouTube">
							<FaYoutube size={18} />
						</SocialIcon>
					</div>

					<div className="mt-8 border-t border-slate-100 pt-5">
						<p className="text-sm text-slate-500">
							© 2026 ZouuSafe. Tous droits réservés.
						</p>
					</div>
				</article>
			</section>
		</footer>
	);
}

type FooterLink = {
	label: string;
	href: string;
};

type FooterColumnProps = {
	title: string;
	links: FooterLink[];
};

function FooterColumn({ title, links }: FooterColumnProps) {
	return (
		<article>
			<h3 className="text-lg font-black text-slate-900">{title}</h3>

			<nav className="mt-5 space-y-3 text-sm text-slate-500">
				{links.map((link) => (
					<p key={link.label}>
						<Link
							href={link.href}
							className="transition-all duration-300 hover:translate-x-1 hover:text-violet-600"
						>
							{link.label}
						</Link>
					</p>
				))}
			</nav>
		</article>
	);
}

function SocialIcon({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			aria-label={label}
			className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-violet-600"
		>
			{children}
		</button>
	);
}
