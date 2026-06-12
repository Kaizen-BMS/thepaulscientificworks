import { NextResponse } from "next/server";
import { getTestimonialById, updateTestimonial, deleteTestimonial } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(_, { params }) {
  const t = getTestimonialById(params.id);
  if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: t });
}

export async function PUT(request, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const t = updateTestimonial(params.id, body);
  if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: t });
}

export async function PATCH(request, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const t = updateTestimonial(params.id, body);
  if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: t });
}

export async function DELETE(_, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const deleted = deleteTestimonial(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}