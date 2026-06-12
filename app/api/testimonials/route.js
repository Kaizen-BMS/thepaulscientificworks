import { NextResponse } from "next/server";
import { getTestimonials, createTestimonial } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const showOnHome = searchParams.get("showOnHome");
  const featured = searchParams.get("featured");
  const limit = parseInt(searchParams.get("limit") || "100");

  let items = getTestimonials();
  if (showOnHome === "true") items = items.filter(t => t.showOnHome);
  if (featured === "true") items = items.filter(t => t.featured);
  items = items.sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, limit);

  return NextResponse.json({ data: items });
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { quote, authorName, authorRole, organization, image, rating, featured, showOnHome, order } = body;
  if (!quote || !authorName) return NextResponse.json({ error: "quote and authorName required" }, { status: 400 });

  const id = `t-${Date.now()}`;
  const item = createTestimonial({
    id, quote, authorName,
    authorRole: authorRole || "",
    organization: organization || "",
    image: image || "",
    rating: rating || 5,
    featured: featured || false,
    showOnHome: showOnHome !== false,
    order: order || 0,
  });
  return NextResponse.json({ data: item }, { status: 201 });
}