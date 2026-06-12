import fs from "fs";
import path from "path";

const ALLOWED = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function getExtension(mimeType) {
  const map = { "image/png": "png", "image/jpeg": "jpg", "image/jpg": "jpg", "image/webp": "webp" };
  return map[mimeType] || "jpg";
}

export async function saveImage(file, folder, filename) {
  if (!ALLOWED.includes(file.type)) throw new Error("Invalid file type. Allowed: png, jpg, webp");
  if (file.size > MAX_SIZE) throw new Error("File too large. Maximum 5MB.");

  const dir = path.join(process.cwd(), "public", folder);
  ensureDir(dir);

  const ext = getExtension(file.type);
  const safeName = filename.replace(/[^a-zA-Z0-9_-]/g, "-");
  const fname = `${safeName}.${ext}`;
  const fp = path.join(dir, fname);

  // Remove existing with any ext
  for (const e of ["png", "jpg", "jpeg", "webp"]) {
    const old = path.join(dir, `${safeName}.${e}`);
    if (fs.existsSync(old)) fs.unlinkSync(old);
  }

  const bytes = await file.arrayBuffer();
  fs.writeFileSync(fp, Buffer.from(bytes));
  return `/${folder}/${fname}`;
}

export function deleteImage(publicPath) {
  if (!publicPath) return;
  const fp = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
}

export async function saveProductImage(file, productId) {
  return saveImage(file, "products", productId);
}

export async function saveBlogImage(file, blogId) {
  return saveImage(file, "blogs", blogId);
}

export async function saveCategoryImage(file, categoryId) {
  return saveImage(file, "categories", categoryId);
}

export async function saveTestimonialImage(file, testimonialId) {
  return saveImage(file, "testimonials", testimonialId);
}