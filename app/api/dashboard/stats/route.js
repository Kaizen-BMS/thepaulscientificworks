import { NextResponse } from "next/server";
import { getProducts, getCategories, getBlogs, getTestimonials, getAdmins } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = getProducts();
  const categories = getCategories();
  const blogs = getBlogs();
  const testimonials = getTestimonials();
  const admins = session.role === "superadmin" ? getAdmins() : [];

  return NextResponse.json({
    data: {
      products: products.length,
      featuredProducts: products.filter(p => p.featured).length,
      categories: categories.length,
      blogs: blogs.length,
      testimonials: testimonials.length,
      admins: admins.length,
    }
  });
}