import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON(filename, fallback = []) {
  ensureDataDir();
  const fp = path.join(DATA_DIR, filename);
  if (!fs.existsSync(fp)) return fallback;
  try {
    const raw = fs.readFileSync(fp, "utf-8").trim();
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`[db] parse error ${filename}:`, e.message);
    return fallback;
  }
}

function writeJSON(filename, data) {
  ensureDataDir();
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
}

function readJSONObject(filename) {
  const result = readJSON(filename, {});
  return Array.isArray(result) ? {} : result;
}

// ── Products ──────────────────────────────────────────────────────────
export const getProducts = () => readJSON("products.json");
export const saveProducts = (d) => writeJSON("products.json", d);
export const getProductById = (id) => getProducts().find(p => p.id === id) ?? null;
export const getProductBySlug = (slug) => getProducts().find(p => p.slug === slug) ?? null;

export function createProduct(data) {
  const products = getProducts();
  const now = new Date().toISOString();
  const product = { ...data, createdAt: now, updatedAt: now };
  products.push(product);
  saveProducts(products);
  return product;
}

export function updateProduct(id, data) {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...data, updatedAt: new Date().toISOString() };
  saveProducts(products);
  return products[idx];
}

export function deleteProduct(id) {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

// ── Categories ────────────────────────────────────────────────────────
export const getCategories = () => readJSON("categories.json");
export const saveCategories = (d) => writeJSON("categories.json", d);
export const getCategoryById = (id) => getCategories().find(c => c.id === id) ?? null;

/**
 * Product count matching:
 * product.categorySlug === cat.id  (primary — used when admin adds product)
 * product.categorySlug === cat.slug (slug alias)
 * product.category === cat.name    (static/legacy data)
 */
export function getCategoriesWithCounts() {
  const cats = getCategories();
  const products = getProducts();
  return cats.map(cat => {
    const id   = (cat.id   || "").toLowerCase().trim();
    const slug = (cat.slug || cat.id || "").toLowerCase().trim();
    const name = (cat.name || "").toLowerCase().trim();
    const count = products.filter(p => {
      const ps = (p.categorySlug || "").toLowerCase().trim();
      const pc = (p.category     || "").toLowerCase().trim();
      return ps === id || ps === slug || pc === name || pc === id;
    }).length;
    return { ...cat, count };
  });
}

export function createCategory(data) {
  const cats = getCategories();
  if (cats.find(c => c.id === data.id)) throw new Error(`Category "${data.id}" already exists`);
  const cat = { ...data, count: 0, createdAt: new Date().toISOString() };
  cats.push(cat);
  saveCategories(cats);
  return cat;
}

export function updateCategory(id, data) {
  const cats = getCategories();
  const idx = cats.findIndex(c => c.id === id);
  if (idx === -1) return null;
  cats[idx] = { ...cats[idx], ...data };
  saveCategories(cats);
  return cats[idx];
}

export function deleteCategory(id) {
  const cats = getCategories();
  const filtered = cats.filter(c => c.id !== id);
  if (filtered.length === cats.length) return false;
  saveCategories(filtered);
  return true;
}

// ── Testimonials ──────────────────────────────────────────────────────
export const getTestimonials = () => readJSON("testimonials.json");
export const saveTestimonials = (d) => writeJSON("testimonials.json", d);
export const getTestimonialById = (id) => getTestimonials().find(t => t.id === id) ?? null;

export function createTestimonial(data) {
  const items = getTestimonials();
  const item = { ...data, id: data.id || `t-${Date.now()}`, createdAt: new Date().toISOString() };
  items.push(item);
  saveTestimonials(items);
  return item;
}

export function updateTestimonial(id, data) {
  const items = getTestimonials();
  const idx = items.findIndex(t => t.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data };
  saveTestimonials(items);
  return items[idx];
}

export function deleteTestimonial(id) {
  const items = getTestimonials();
  const filtered = items.filter(t => t.id !== id);
  if (filtered.length === items.length) return false;
  saveTestimonials(filtered);
  return true;
}

// ── Blogs ─────────────────────────────────────────────────────────────
export const getBlogs = () => readJSON("blogs.json");
export const saveBlogs = (d) => writeJSON("blogs.json", d);
export const getBlogById = (id) => getBlogs().find(b => b.id === id) ?? null;

/** Case-insensitive slug lookup */
export function getBlogBySlug(slug) {
  if (!slug) return null;
  const s = slug.toLowerCase().trim();
  return getBlogs().find(b => (b.slug || "").toLowerCase().trim() === s) ?? null;
}

export function createBlog(data) {
  const items = getBlogs();
  const now = new Date().toISOString();
  const item = { ...data, createdAt: now, updatedAt: now };
  items.push(item);
  saveBlogs(items);
  return item;
}

export function updateBlog(id, data) {
  const items = getBlogs();
  const idx = items.findIndex(b => b.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
  saveBlogs(items);
  return items[idx];
}

export function deleteBlog(id) {
  const items = getBlogs();
  const filtered = items.filter(b => b.id !== id);
  if (filtered.length === items.length) return false;
  saveBlogs(filtered);
  return true;
}

// ── Admins ────────────────────────────────────────────────────────────
export const getAdmins = () => readJSON("admins.json");
export const saveAdmins = (d) => writeJSON("admins.json", d);
export const getAdminByEmail = (email) =>
  getAdmins().find(a => a.email?.toLowerCase() === email?.toLowerCase()) ?? null;
export const getAdminById = (id) => getAdmins().find(a => a.id === id) ?? null;

export function createAdmin(data) {
  const admins = getAdmins();
  if (admins.find(a => a.email?.toLowerCase() === data.email?.toLowerCase()))
    throw new Error("Admin with this email already exists");
  const maxId = admins.reduce((m, a) => Math.max(m, Number(a.id) || 0), 0);
  const admin = { ...data, id: maxId + 1, createdAt: new Date().toISOString() };
  admins.push(admin);
  saveAdmins(admins);
  return admin;
}

export function updateAdmin(id, data) {
  const admins = getAdmins();
  const idx = admins.findIndex(a => a.id === id);
  if (idx === -1) return null;
  admins[idx] = { ...admins[idx], ...data };
  saveAdmins(admins);
  return admins[idx];
}

export function deleteAdmin(id) {
  const admins = getAdmins();
  const filtered = admins.filter(a => a.id !== id);
  if (filtered.length === admins.length) return false;
  saveAdmins(filtered);
  return true;
}

// ── Settings ──────────────────────────────────────────────────────────
export const getSettings = () => readJSONObject("settings.json");
export const saveSettings = (d) => writeJSON("settings.json", d);
export function updateSettings(data) {
  const updated = { ...getSettings(), ...data };
  saveSettings(updated);
  return updated;
}

// ── Enquiries ─────────────────────────────────────────────────────────
export const getEnquiries = () => readJSON("enquiries.json");
export const saveEnquiries = (d) => writeJSON("enquiries.json", d);
export const getEnquiryById = (id) => getEnquiries().find(e => e.id === id) ?? null;

export function createEnquiry(data) {
  const items = getEnquiries();
  const count = items.length + 1;
  const id = `ENQ-${String(count).padStart(4, "0")}-${Date.now().toString().slice(-5)}`;
  const item = { ...data, id, status: data.status || "new", createdAt: new Date().toISOString() };
  items.unshift(item);
  saveEnquiries(items);
  return item;
}

export function updateEnquiry(id, data) {
  const items = getEnquiries();
  const idx = items.findIndex(e => e.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
  saveEnquiries(items);
  return items[idx];
}

export function deleteEnquiry(id) {
  const items = getEnquiries();
  const filtered = items.filter(e => e.id !== id);
  if (filtered.length === items.length) return false;
  saveEnquiries(filtered);
  return true;
}

export function getEnquiryStats() {
  const items = getEnquiries();
  return {
    total: items.length,
    new: items.filter(e => e.status === "new").length,
    contacted: items.filter(e => e.status === "contacted").length,
    quotationSent: items.filter(e => e.status === "quotation-sent").length,
    completed: items.filter(e => e.status === "completed").length,
    archived: items.filter(e => e.status === "archived").length,
  };
}