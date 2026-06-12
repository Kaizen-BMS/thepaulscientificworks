import { NextResponse } from "next/server";
import { getEnquiries, createEnquiry, getEnquiryStats } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const source = searchParams.get("source");
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const statsOnly = searchParams.get("stats") === "true";

  if (statsOnly) {
    return NextResponse.json({ data: getEnquiryStats() });
  }

  let items = getEnquiries();

  if (status) items = items.filter(e => e.status === status);
  if (source) items = items.filter(e => e.source === source);

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    items = items.filter(e =>
      e.name?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.phone?.toLowerCase().includes(q) ||
      e.subject?.toLowerCase().includes(q) ||
      e.productName?.toLowerCase().includes(q) ||
      e.company?.toLowerCase().includes(q)
    );
  }

  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const paginated = items.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ data: paginated, total, totalPages, page, stats: getEnquiryStats() });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, subject, message, source, productId, productName } = body;

    if (!name || !message) {
      return NextResponse.json({ error: "name and message are required" }, { status: 400 });
    }

    const enquiry = createEnquiry({
      name: name.trim(),
      email: email?.trim() || "",
      phone: phone?.trim() || "",
      company: company?.trim() || "",
      subject: subject?.trim() || "General Enquiry",
      message: message.trim(),
      source: source || "contact-form",
      productId: productId || null,
      productName: productName || null,
      status: "new",
    });

    return NextResponse.json({ success: true, data: enquiry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/enquiries:", error);
    return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
  }
}