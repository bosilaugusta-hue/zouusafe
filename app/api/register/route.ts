import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type RegisterBody = {
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
};

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as RegisterBody;

		const firstName = body.firstName?.trim();
		const lastName = body.lastName?.trim();
		const email = body.email?.trim().toLowerCase();
		const password = body.password;
		const confirmPassword = body.confirmPassword;

		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			return NextResponse.json(
				{ message: "Tous les champs sont obligatoires." },
				{ status: 400 },
			);
		}

		if (password.length < 12) {
			return NextResponse.json(
				{ message: "Le mot de passe doit contenir au moins 12 caractères." },
				{ status: 400 },
			);
		}

		if (password !== confirmPassword) {
			return NextResponse.json(
				{ message: "Les mots de passe ne correspondent pas." },
				{ status: 400 },
			);
		}

		const [existingParents] = await db.execute(
			"SELECT parent_id FROM parent WHERE email = ? LIMIT 1",
			[email],
		);

		if (Array.isArray(existingParents) && existingParents.length > 0) {
			return NextResponse.json(
				{ message: "Cette adresse email est déjà utilisée." },
				{ status: 409 },
			);
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		await db.execute(
			`INSERT INTO parent
        (first_name, last_name, email, password)
       VALUES (?, ?, ?, ?)`,
			[firstName, lastName, email, hashedPassword],
		);

		return NextResponse.json(
			{ message: "Compte parent créé avec succès." },
			{ status: 201 },
		);
	} catch (error) {
		console.error("Erreur lors de l’inscription :", error);

		return NextResponse.json(
			{ message: "Une erreur est survenue pendant l’inscription." },
			{ status: 500 },
		);
	}
}
