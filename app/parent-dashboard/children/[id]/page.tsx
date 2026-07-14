import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { db } from "@/lib/db";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

type SessionPayload = {
    parentId: number;
};

type ChildRow = RowDataPacket & {
    child_id: number;
    first_name: string;
    birth_date: string;
    avatar_url: string | null;
    screen_time_limit: number | null;
    screen_time_used: number | null;
    filter_level: string | null;
    safe_search: boolean | null;
};

type SearchHistoryRow = RowDataPacket & {
    search_history_id: number;
    search_query: string;
    created_at: Date;
};

type AlertRow = RowDataPacket & {
    alert_id: number;
    message: string;
    severity: string;
    created_at: Date;
};

function getSecretKey() {
    const secret = process.env.AUTH_SECRET;

    if (!secret) {
        throw new Error("AUTH_SECRET est absent de .env.local.");
    }

    return new TextEncoder().encode(secret);
}

function calculateAge(birthDate: string) {
    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    const monthDifference = today.getMonth() - birth.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
        age -= 1;
    }

    return age;
}

export default async function ChildProfilePage({
    params,
}: PageProps) {
    const { id } = await params;
    const childId = Number(id);

    if (!Number.isInteger(childId) || childId <= 0) {
        notFound();
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("zouusafe_session")?.value;

    if (!token) {
        notFound();
    }

    const { payload } = await jwtVerify(token, getSecretKey());
    const { parentId } = payload as SessionPayload;

    const [children] = await db.query<ChildRow[]>(
        `
			SELECT
				child.child_id,
				child.first_name,
				child.birth_date,
				child.avatar_url,
				safety_setting.screen_time_limit,
				safety_setting.screen_time_used,
				safety_setting.filter_level,
				safety_setting.safe_search
			FROM child
			LEFT JOIN safety_setting
				ON safety_setting.child_id = child.child_id
			WHERE child.child_id = ?
				AND child.parent_id = ?
			LIMIT 1
		`,
        [childId, parentId],
    );

    const child = children[0];

    if (!child) {
        notFound();
    }

    const [history] = await db.query<SearchHistoryRow[]>(
        `
		SELECT
			search_history_id,
			search_query,
			created_at
		FROM search_history
		WHERE child_id = ?
		ORDER BY created_at DESC
		LIMIT 5
	`,
        [childId],
    );

    const [alerts] = await db.query<AlertRow[]>(
        `
		SELECT
			alert_id,
			message,
			severity,
			created_at
		FROM alert
		WHERE child_id = ?
		ORDER BY created_at DESC
		LIMIT 5
	`,
        [childId],
    );

    const age = calculateAge(child.birth_date);

    const avatar =
        child.avatar_url ?? "/avatars_profil/fille_1.png";

    const avatarSrc = avatar.startsWith("/")
        ? avatar
        : `/${avatar}`;

    const screenTimeLimit =
        child.screen_time_limit ?? 120;

    const screenTimeUsed =
        child.screen_time_used ?? 0;

    const progress = Math.min(
        100,
        Math.round(
            (screenTimeUsed / screenTimeLimit) * 100,
        ),
    );

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7efff] to-[#fff6df] px-6 py-10 text-slate-900">
            <section className="mx-auto max-w-5xl">
                <Link
                    href="/parent-dashboard"
                    className="font-black text-violet-600 hover:underline"
                >
                    ← Retour au tableau de bord
                </Link>

                <section className="mt-6 rounded-[2rem] bg-white/95 p-8 shadow-xl">
                    <header className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                        <Image
                            src={avatarSrc}
                            alt={`Avatar de ${child.first_name}`}
                            width={160}
                            height={160}
                            className="h-40 w-40 rounded-full border-8 border-violet-100 object-cover shadow-lg"
                        />

                        <div>
                            <p className="font-black text-violet-600">
                                Profil enfant
                            </p>

                            <h1 className="mt-2 text-4xl font-black">
                                {child.first_name}
                            </h1>

                            <p className="mt-2 text-lg text-slate-600">
                                {age} {age > 1 ? "ans" : "an"}
                            </p>

                            <span className="mt-4 inline-flex rounded-full bg-green-100 px-4 py-2 font-black text-green-700">
                                Protection active
                            </span>
                        </div>
                    </header>

                    <section className="mt-10 grid gap-6 md:grid-cols-2">
                        <article className="rounded-3xl border border-violet-100 bg-violet-50 p-6">
                            <h2 className="text-2xl font-black">
                                Temps d’écran
                            </h2>

                            <p className="mt-3 text-slate-600">
                                {screenTimeUsed} min utilisées sur{" "}
                                {screenTimeLimit} min
                            </p>

                            <div className="mt-5 h-4 overflow-hidden rounded-full bg-white">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>
                        </article>

                        <article className="rounded-3xl border border-pink-100 bg-pink-50 p-6">
                            <h2 className="text-2xl font-black">
                                Sécurité
                            </h2>

                            <p className="mt-3 text-slate-600">
                                Filtre :{" "}
                                <strong>
                                    {child.filter_level ?? "standard"}
                                </strong>
                            </p>

                            <p className="mt-2 text-slate-600">
                                Recherche sécurisée :{" "}
                                <strong>
                                    {child.safe_search ?? true
                                        ? "Activée"
                                        : "Désactivée"}
                                </strong>
                            </p>
                        </article>
                    </section>

                    <section className="mt-6 grid gap-6 md:grid-cols-2">
                        <article className="min-h-64 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                            <h2 className="text-2xl font-black">
                                Historique récent
                            </h2>

                            {history.length === 0 ? (
                                <p className="mt-4 text-slate-500">
                                    Aucune recherche enregistrée pour le moment.
                                </p>
                            ) : (
                                <ul className="mt-5 space-y-3">
                                    {history.map((item) => (
                                        <li
                                            key={item.search_history_id}
                                            className="rounded-2xl bg-violet-50 px-4 py-3"
                                        >
                                            <p className="font-black text-slate-900">
                                                {item.search_query}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {new Intl.DateTimeFormat("fr-FR", {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                }).format(new Date(item.created_at))}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </article>

                        <article className="min-h-64 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                            <h2 className="text-2xl font-black">
                                Alertes récentes
                            </h2>

                            {alerts.length === 0 ? (
                                <p className="mt-4 text-slate-500">
                                    Aucune alerte pour le moment.
                                </p>
                            ) : (
                                <ul className="mt-5 space-y-3">
                                    {alerts.map((alert) => {
                                        const severityClass =
                                            alert.severity === "high"
                                                ? "bg-red-50 text-red-700"
                                                : alert.severity === "medium"
                                                    ? "bg-orange-50 text-orange-700"
                                                    : "bg-blue-50 text-blue-700";

                                        return (
                                            <li
                                                key={alert.alert_id}
                                                className={`rounded-2xl px-4 py-3 ${severityClass}`}
                                            >
                                                <p className="font-black">
                                                    {alert.message}
                                                </p>

                                                <p className="mt-1 text-xs opacity-70">
                                                    {new Intl.DateTimeFormat("fr-FR", {
                                                        dateStyle: "short",
                                                        timeStyle: "short",
                                                    }).format(new Date(alert.created_at))}
                                                </p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </article>
                    </section>
                </section>
            </section>
        </main>
    );
}