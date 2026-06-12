import { NextResponse } from "next/server";
import { getAdmins, createAdmin } from "@/lib/db";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admins = getAdmins().map(({ password, ...rest }) => rest);
  return NextResponse.json({ data: admins });
}

export async function POST(request) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, email, password, role } = await request.json();
    if (!name || !email || !password) return NextResponse.json({ error: "name, email, password required" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 12);
    const admin = createAdmin({ name, email: email.toLowerCase(), password: hashed, role: role || "admin" });
    const { password: _, ...safe } = admin;
    return NextResponse.json({ data: safe }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}