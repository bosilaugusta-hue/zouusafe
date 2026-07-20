import {
	Baby,
	Bell,
	BookOpen,
	Clock3,
	LockKeyhole,
	type LucideIcon,
	Search,
	ShieldCheck,
	UserRound,
} from "lucide-react";

export type Feature = {
	title: string;
	description: string;
	image: string;
	icon: LucideIcon;
	cardClass: string;
	iconClass: string;
	titleClass: string;
};

export type Step = {
	number: string;
	title: string;
	description: string;
	icon: LucideIcon;
};

export const features: Feature[] = [
	{
		title: "Recherche sécurisée",
		description:
			"Les contenus inadaptés sont filtrés avant d’être affichés aux enfants.",
		image: "/mascottes/Renard-detective.png",
		icon: ShieldCheck,
		cardClass: "border-violet-200 bg-violet-50/40",
		iconClass: "bg-violet-100 text-violet-600",
		titleClass: "text-violet-700",
	},
	{
		title: "Temps d’écran maîtrisé",
		description:
			"Définissez facilement une limite adaptée au rythme de votre enfant.",
		image: "/mascottes/Renard-chronometre.png",
		icon: Clock3,
		cardClass: "border-blue-200 bg-blue-50/40",
		iconClass: "bg-blue-100 text-blue-600",
		titleClass: "text-blue-700",
	},
	{
		title: "Alertes intelligentes",
		description:
			"Recevez une alerte lorsqu’une activité nécessite votre attention.",
		image: "/mascottes/Renard-cloche.png",
		icon: Bell,
		cardClass: "border-orange-200 bg-orange-50/40",
		iconClass: "bg-orange-100 text-orange-600",
		titleClass: "text-orange-600",
	},
	{
		title: "Validation parentale",
		description:
			"Gardez le contrôle des paramètres et des autorisations de navigation.",
		image: "/mascottes/Renard-telephone.png",
		icon: LockKeyhole,
		cardClass: "border-green-200 bg-green-50/40",
		iconClass: "bg-green-100 text-green-600",
		titleClass: "text-green-700",
	},
	{
		title: "Apprendre en confiance",
		description:
			"Les enfants découvrent internet dans un environnement adapté à leur âge.",
		image: "/mascottes/Renard-ordinateur.png",
		icon: BookOpen,
		cardClass: "border-pink-200 bg-pink-50/40",
		iconClass: "bg-pink-100 text-pink-600",
		titleClass: "text-pink-600",
	},
	{
		title: "Protection active",
		description:
			"Zouu accompagne chaque exploration pour rendre la navigation plus sûre.",
		image: "/mascottes/Robot-protecteur.png",
		icon: ShieldCheck,
		cardClass: "border-cyan-200 bg-cyan-50/40",
		iconClass: "bg-cyan-100 text-cyan-600",
		titleClass: "text-cyan-700",
	},
];

export const steps: Step[] = [
	{
		number: "1",
		title: "Le parent crée un compte",
		description: "Il s’inscrit rapidement depuis l’espace parent.",
		icon: UserRound,
	},
	{
		number: "2",
		title: "Il ajoute son enfant",
		description: "Il crée un profil adapté à son âge et à ses besoins.",
		icon: Baby,
	},
	{
		number: "3",
		title: "L’enfant explore",
		description: "Il effectue ses recherches dans son espace sécurisé.",
		icon: Search,
	},
	{
		number: "4",
		title: "ZouuSafe protège",
		description: "Les contenus sensibles sont filtrés et signalés au parent.",
		icon: ShieldCheck,
	},
];
