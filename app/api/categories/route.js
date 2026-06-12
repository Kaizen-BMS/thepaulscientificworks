import { NextResponse } from "next/server";
import { getCategories, getCategoriesWithCounts, createCategory } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const withCounts = searchParams.get("counts") === "true";
    const featured   = searchParams.get("featured");

    let cats = withCounts ? getCategoriesWithCounts() : getCategories();
    if (featured === "true") cats = cats.filter(c => c.featured);

    // Sort by order field
    cats = cats.sort((a, b) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({ data: cats });
  } catch (e) {
    console.error("GET /api/categories:", e);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, name, slug, description, icon, gradient, image, featured, order } = body;
    if (!id || !name) return NextResponse.json({ error: "id and name required" }, { status: 400 });

    const cat = createCategory({
      id,
      name,
      slug: slug || id,
      description: description || "",
      icon: icon || "Package",
      gradient: gradient || "from-blue-500 to-blue-700",
      image: image || "",
      featured: featured || false,
      order: order || 0,
    });
    return NextResponse.json({ data: cat }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}