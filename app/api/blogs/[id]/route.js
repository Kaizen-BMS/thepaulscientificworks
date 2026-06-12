import { NextResponse } from "next/server";
import { getBlogById, getBlogBySlug, updateBlog, deleteBlog } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(_, { params }) {
  // Try by id first, then by slug (case-insensitive)
  const blog = getBlogById(params.id) || getBlogBySlug(params.id);
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: blog });
}

export async function PUT(request, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  // Normalise slug on update
  if (body.slug) body.slug = body.slug.toLowerCase().trim();
  const blog = updateBlog(params.id, body);
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: blog });
}

export async function PATCH(request, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (body.slug) body.slug = body.slug.toLowerCase().trim();
  const blog = updateBlog(params.id, body);
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: blog });
}

export async function DELETE(_, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const deleted = deleteBlog(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}