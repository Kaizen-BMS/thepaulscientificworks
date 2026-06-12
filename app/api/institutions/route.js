import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const page = parseInt(searchParams.get("page") || "1");

    const where = { isActive: true };

    const [data, total] = await Promise.all([
      prisma.institutionType.findMany({
        where,
        include: {
          _count: { select: { categories: true } },
        },
        orderBy: [{ order: "asc" }, { name: "asc" }],
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.institutionType.count({ where }),
    ]);

    return NextResponse.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET /api/institutions error:", error);
    return NextResponse.json({ error: "Failed to fetch institutions" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug, description, icon, order, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
    }

    const existing = await prisma.institutionType.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 400 });

    const institution = await prisma.institutionType.create({
      data: {
        name,
        slug,
        description,
        icon,
        order: order || 0,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ data: institution }, { status: 201 });
  } catch (error) {
    console.error("POST /api/institutions error:", error);
    return NextResponse.json({ error: "Failed to create institution" }, { status: 500 });
  }
}