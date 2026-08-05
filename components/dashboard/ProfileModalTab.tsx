"use client";

type ProfileModalTabProps = {
	label: string;
	active: boolean;
	onClick: () => void;
};

export default function ProfileModalTab({
	label,
	active,
	onClick,
}: ProfileModalTabProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`border-b-2 px-2 pb-3 text-sm font-black transition ${
				active
					? "border-violet-600 text-violet-700"
					: "border-transparent text-slate-400 hover:text-slate-700"
			}`}
		>
			{label}
		</button>
	);
}
