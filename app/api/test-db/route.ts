import { db } from "@/lib/db";

export async function GET() {
  const [rows] = await db.query("SELECT DATABASE() AS database_name");

  return Response.json(rows);
}