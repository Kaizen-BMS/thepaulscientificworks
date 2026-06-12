import { NextResponse } from "next/server";
import { getProducts, createProduct, getProductById } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category  = searchParams.get("category");
    const search    = searchParams.get("search") || "";
    const featured  = searchParams.get("featured");
    const showOnHome = searchParams.get("showOnHome");
    const limit     = parseInt(searchParams.get("limit") || "500");

    let products = getProducts();

    if (category) {
      const cat = category.toLowerCase().trim();
      products = products.filter(p => {
        const ps = (p.categorySlug || "").toLowerCase().trim();
        const pc = (p.category     || "").toLowerCase().trim();
        return ps === cat || pc === cat;
      });
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      products = products.filter(p =>
        (p.name             || "").toLowerCase().includes(q) ||
        (p.id               || "").toLowerCase().includes(q) ||
        (p.shortDescription || "").toLowerCase().includes(q) ||
        (p.category         || "").toLowerCase().includes(q) ||
        (p.categorySlug     || "").toLowerCase().includes(q)
      );
    }

    if (featured  === "true") products = products.filter(p => p.featured);
    if (showOnHome === "true") products = products.filter(p => p.showOnHome || p.featured);

    const total = products.length;
    products = products.slice(0, limit);

    return NextResponse.json({ data: products, total });
  } catch (e) {
    console.error("GET /api/products:", e);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, name, category, categorySlug, image, shortDescription,
            fullDescription, features, featured, slug } = body;

    if (!id || !name || !category)
      return NextResponse.json({ error: "id, name, category required" }, { status: 400 });

    if (getProductById(id))
      return NextResponse.json({ error: "Product ID already exists" }, { status: 400 });

    const product = createProduct({
      id,
      name,
      category,
      categorySlug: categorySlug || category.toLowerCase().replace(/\s+/g, "-"),
      slug: slug || id.toLowerCase(),
      image: image || `/products/${id}.png`,
      shortDescription: shortDescription || "",
      fullDescription: fullDescription || "",
      features: features || [],
      featured: featured || false,
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}