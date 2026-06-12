import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveBlogImage } from "@/lib/imageUpload";
import { updateBlog } from "@/lib/db";

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("image");
  const blogId = formData.get("blogId");

  if (!file || !blogId) return NextResponse.json({ error: "image and blogId required" }, { status: 400 });

  try {
    const imagePath = await saveBlogImage(file, blogId);
    updateBlog(blogId, { image: imagePath });
    return NextResponse.json({ success: true, imagePath });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}