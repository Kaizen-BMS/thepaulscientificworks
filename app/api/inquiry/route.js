import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "newest";

    const where = {};
    if (status) where.status = status;

    const [data, total, unread] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: { product: { select: { id: true, name: true, productCode: true, slug: true } } },
        orderBy: sort === "newest" ? { createdAt: "desc" } : { createdAt: "asc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.inquiry.count({ where }),
      prisma.inquiry.count({ where: { isRead: false } }),
    ]);

    return NextResponse.json({ data, total, unread, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, organization, message, productCode, productName } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "name, email, message are required" }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        organization,
        message,
        productCode: productCode ? parseInt(productCode) : null,
        productName,
        status: "new",
        isRead: false,
      },
    });

    return NextResponse.json({ data: inquiry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/inquiries error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}