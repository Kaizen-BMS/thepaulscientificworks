import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hero slides" }, { status: 500 });
  }
}