import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ data: getSettings() });
}

export async function PUT(request) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const updated = updateSettings(body);
  return NextResponse.json({ data: updated });
}