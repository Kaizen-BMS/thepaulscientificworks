import { NextResponse } from "next/server";
import { getBlogs, createBlog } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured   = searchParams.get("featured");
    const showOnHome = searchParams.get("showOnHome");
    const category   = searchParams.get("category");
    const limit      = parseInt(searchParams.get("limit") || "100");
    const page       = parseInt(searchParams.get("page")  || "1");

    let items = getBlogs();
    if (featured   === "true") items = items.filter(b => b.featured);
    if (showOnHome === "true") items = items.filter(b => b.showOnHome);
    if (category) items = items.filter(b =>
      (b.category || "").toLowerCase() === category.toLowerCase()
    );

    items = [...items].sort((a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    const total      = items.length;
    const totalPages = Math.ceil(total / limit);
    const paginated  = items.slice((page - 1) * limit, page * limit);

    return NextResponse.json({ data: paginated, total, totalPages, page });
  } catch (e) {
    console.error("GET /api/blogs:", e);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, slug, excerpt, content, category, author,
            featured, showOnHome, image, tags, metaTitle, metaDescription } = body;

    if (!title || !slug) return NextResponse.json({ error: "title and slug required" }, { status: 400 });

    const blog = createBlog({
      id: `blog-${Date.now()}`,
      title,
      slug: slug.toLowerCase().trim(),
      excerpt: excerpt || "",
      content: content || "",
      category: category || "General",
      author: author || "Admin",
      featured: featured || false,
      showOnHome: showOnHome || false,
      image: image || "/blogs/placeholder.jpg",
      tags: tags || [],
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || "",
    });
    return NextResponse.json({ data: blog }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}