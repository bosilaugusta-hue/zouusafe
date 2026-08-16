import { NextResponse } from "next/server";

export async function POST() {
	const response = NextResponse.json(
		{ message: "Déconnexion réussie." },
		{ status: 200 },
	);

	response.cookies.set("zouusafe_session", "", {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 0,
	});

	return response;
}