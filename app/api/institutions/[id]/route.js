import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const institution = await prisma.institutionType.findUnique({
      where: { id },
      include: {
        categories: {
          include: { _count: { select: { products: true } } },
          orderBy: { order: "asc" },
        },
      },
    });
    if (!institution) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: institution });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch institution" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const institution = await prisma.institutionType.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.slug && { slug: body.slug }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });
    return NextResponse.json({ data: institution });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update institution" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const institution = await prisma.institutionType.update({ where: { id }, data: body });
    return NextResponse.json({ data: institution });
  } catch (error) {
    return NextResponse.json({ error: "Failed to patch institution" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    await prisma.institutionType.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete institution" }, { status: 500 });
  }
}