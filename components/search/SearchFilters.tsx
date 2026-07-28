import {
	BookOpen,
	Gamepad2,
	Grid2X2,
	ImageIcon,
	Pencil,
	Video,
} from "lucide-react";
import Link from "next/link";

const filters = [
	{
		label: "Tous",
		value: "all",
		icon: Grid2X2,
	},
	{
		label: "Images",
		value: "images",
		icon: ImageIcon,
	},
	{
		label: "Vidéos",
		value: "videos",
		icon: Video,
	},
	{
		label: "Histoires",
		value: "stories",
		icon: BookOpen,
	},
	{
		label: "Jeux",
		value: "games",
		icon: Gamepad2,
	},
	{
		label: "Coloriages",
		value: "coloring",
		icon: Pencil,
	},
];

type SearchFiltersProps = {
	childId: number;
	query: string;
	activeFilter?: string;
};

export default function SearchFilters({
	childId,
	query,
	activeFilter = "all",
}: SearchFiltersProps) {
	return (
		<nav aria-label="Filtres de recherche" className="flex flex-wrap gap-3">
			{filters.map((filter) => {
				const Icon = filter.icon;
				const isActive = activeFilter === filter.value;

				const href = `/child-dashboard/search?childId=${childId}&query=${encodeURIComponent(
					query,
				)}&filter=${filter.value}`;

				return (
					<Link
						key={filter.value}
						href={href}
						className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-black shadow-sm transition ${
							isActive
								? "border-violet-400 bg-violet-50 text-violet-700"
								: "border-white bg-white text-slate-700 hover:-translate-y-0.5 hover:bg-violet-50"
						}`}
					>
						<Icon
							size={19}
							className={isActive ? "text-violet-600" : "text-slate-500"}
						/>

						{filter.label}
					</Link>
				);
			})}
		</nav>
	);
}
