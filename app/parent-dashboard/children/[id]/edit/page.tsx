import type { RowDataPacket } from "mysql2";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import EditChildForm from "@/components/parent/EditChildForm";
import { db } from "@/lib/db";

type EditChildPageProps = {
	params: Promise<{
		id: string;
	}>;
};

type ChildRow = RowDataPacket & {
	child_id: number;
	first_name: string;
	birth_date: string | Date;
	gender: string;
	avatar_url: string;
};

function formatBirthDate(value: string | Date) {
	if (value instanceof Date) {
		return value.toISOString().split("T")[0];
	}

	return value.split("T")[0];
}

export default async function EditChildPage({ params }: EditChildPageProps) {
	const { id } = await params;
	const childId = Number(id);

	if (!Number.isInteger(childId) || childId <= 0) {
		notFound();
	}

	const [children] = await db.query<ChildRow[]>(
		`
			SELECT
				child_id,
				first_name,
				birth_date,
				gender,
				avatar_url
			FROM child
			WHERE child_id = ?
			LIMIT 1
		`,
		[childId],
	);

	const child = children[0];

	if (!child) {
		notFound();
	}

	const formattedChild = {
		...child,
		birth_date: formatBirthDate(child.birth_date),
	};

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] px-4 py-10 sm:px-6">
			<section className="mx-auto w-full max-w-[620px] rounded-[30px] border border-white/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(88,80,150,0.16)] backdrop-blur-xl sm:p-9">
				<Link
					href="/parent-dashboard"
					className="text-sm font-bold text-violet-600 transition hover:text-violet-800"
				>
					← Retour au dashboard
				</Link>

				<div className="mt-6 text-center">
					<Image
						src="/images/robot-zouusafe.png"
						alt="Robot ZouuSafe"
						width={110}
						height={110}
						className="mx-auto h-24 w-auto object-contain"
					/>

					<p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-violet-500">
						Profil enfant
					</p>

					<h1 className="mt-2 text-3xl font-black text-slate-900">
						Modifier {child.first_name}
					</h1>

					<p className="mt-2 text-sm leading-6 text-slate-500">
						Modifiez ses informations ou choisissez un nouvel avatar.
					</p>
				</div>

				<EditChildForm child={formattedChild} />
			</section>
		</main>
	);
}
