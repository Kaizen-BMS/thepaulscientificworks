import { NextResponse } from "next/server";
import { getProducts, createProduct, getProductById } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");

  let products = getProducts();

  if (category) {
    products = products.filter(p => p.categorySlug === category || p.category?.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q) ||
      p.shortDescription?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  }
  if (featured === "true") {
    products = products.filter(p => p.featured);
  }

  return NextResponse.json({ data: products, total: products.length });
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, name, category, categorySlug, image, shortDescription, fullDescription, features, featured, slug } = body;

    if (!id || !name || !category) {
      return NextResponse.json({ error: "id, name, category required" }, { status: 400 });
    }

    const existing = getProductById(id);
    if (existing) return NextResponse.json({ error: "Product ID already exists" }, { status: 400 });

    const product = createProduct({
      id, name, category, categorySlug: categorySlug || category.toLowerCase().replace(/\s+/g, "-"),
      slug: slug || id.toLowerCase(),
      image: image || `/products/${id}.png`,
      shortDescription: shortDescription || "",
      fullDescription: fullDescription || "",
      features: features || [],
      featured: featured || false,
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}