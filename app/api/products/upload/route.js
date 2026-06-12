import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveProductImage } from "@/lib/imageUpload";
import { updateProduct } from "@/lib/db";

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const productId = formData.get("productId");

    if (!file || !productId) {
      return NextResponse.json({ error: "image and productId required" }, { status: 400 });
    }

    const imagePath = await saveProductImage(file, productId);
    updateProduct(productId, { image: imagePath });

    return NextResponse.json({ success: true, imagePath });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}