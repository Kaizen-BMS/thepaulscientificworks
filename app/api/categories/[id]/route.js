import { NextResponse } from "next/server";
import { getCategoryById, updateCategory, deleteCategory } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(_, { params }) {
  const cat = getCategoryById(params.id);
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: cat });
}

export async function PUT(request, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const cat = updateCategory(params.id, body);
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: cat });
}

export async function DELETE(_, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const deleted = deleteCategory(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}