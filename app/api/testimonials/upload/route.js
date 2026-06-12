import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveTestimonialImage } from "@/lib/imageUpload";
import { updateTestimonial } from "@/lib/db";

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("image");
  const testimonialId = formData.get("testimonialId");

  if (!file || !testimonialId) return NextResponse.json({ error: "image and testimonialId required" }, { status: 400 });

  try {
    const imagePath = await saveTestimonialImage(file, testimonialId);
    updateTestimonial(testimonialId, { image: imagePath });
    return NextResponse.json({ success: true, imagePath });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}