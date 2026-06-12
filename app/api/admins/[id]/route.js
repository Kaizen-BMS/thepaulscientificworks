import { NextResponse } from "next/server";
import { getAdminById, updateAdmin, deleteAdmin } from "@/lib/db";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PUT(request, { params }) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (body.password) body.password = await bcrypt.hash(body.password, 12);

  const admin = updateAdmin(Number(params.id), body);
  if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { password, ...safe } = admin;
  return NextResponse.json({ data: safe });
}

export async function DELETE(_, { params }) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const target = getAdminById(Number(params.id));
  if (target?.role === "superadmin") return NextResponse.json({ error: "Cannot delete superadmin" }, { status: 403 });

  const deleted = deleteAdmin(Number(params.id));
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}