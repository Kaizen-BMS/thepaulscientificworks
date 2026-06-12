import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.inquiry.update({ where: { id }, data: { isRead: true } });
    return NextResponse.json({ data: { ...inquiry, isRead: true } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inquiry" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const inquiry = await prisma.inquiry.update({ where: { id }, data: body });
    return NextResponse.json({ data: inquiry });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    await prisma.inquiry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}