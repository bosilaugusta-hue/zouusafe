import crypto from "crypto";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          message: "Adresse email obligatoire.",
        },
        {
          status: 400,
        }
      );
    }

    const [parents] = await db.query(
      `
      SELECT parent_id,email
      FROM parent
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    const parent = (parents as Array<{
  parent_id: number;
  email: string;
}>)[0];

    if (!parent) {
      return NextResponse.json({
        message:
          "Si un compte existe, un email de réinitialisation sera envoyé.",
      });
    }

    const token = crypto.randomUUID();

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const expiresAt = new Date(
      Date.now() + 1000 * 60 * 60
    );

    await db.query(
      `
      INSERT INTO password_reset_token
      (
        token_hash,
        expires_at,
        parent_id
      )
      VALUES (?, ?, ?)
      `,
      [
        tokenHash,
        expiresAt,
        parent.parent_id,
      ]
    );

    console.log(
      "Lien de réinitialisation :",
      `http://localhost:3000/reset-password?token=${token}`
    );

    return NextResponse.json({
      message:
        "Si un compte existe, un email de réinitialisation sera envoyé.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Erreur serveur.",
      },
      {
        status: 500,
      }
    );
  }
}