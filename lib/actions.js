// lib/actions.js
"use server";
import prisma from "./prisma";
import { createSlug } from "./utils";
import { revalidatePath } from "next/cache";

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
export async function getProducts({ page = 1, limit = 20, institutionId, categoryId, subCategoryId, search, featured } = {}) {
  const skip = (page - 1) * limit;
  const where = { isActive: true };
  if (featured) where.isFeatured = true;
  if (search) where.name = { contains: search };
  if (subCategoryId) {
    where.subCategoryId = Number(subCategoryId);
  } else if (categoryId) {
    where.subCategory = { categoryId: Number(categoryId) };
  } else if (institutionId) {
    where.subCategory = { category: { institutionTypeId: Number(institutionId) } };
  }
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        subCategory: { include: { category: { include: { institutionType: true } } } },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);
  return { products, total, pages: Math.ceil(total / limit) };
}

export async function getProductBySlug(slug) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      pdfs: true,
      subCategory: { include: { category: { include: { institutionType: true } } } },
    },
  });
}

export async function getAllProductsGrouped() {
  const institutions = await prisma.institutionType.findMany({
    where: { isActive: true },
    include: {
      categories: {
        where: { isActive: true },
        include: {
          subcategories: {
            where: { isActive: true },
            include: {
              products: {
                where: { isActive: true },
                include: { images: { where: { isMain: true }, take: 1 } },
                orderBy: { sortOrder: "asc" },
              },
            },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
  return institutions;
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { images: { where: { isMain: true }, take: 1 }, subCategory: { include: { category: true } } },
    orderBy: { sortOrder: "asc" },
    take: 8,
  });
}

export async function createProduct(data) {
  const slug = createSlug(data.name);
  return prisma.product.create({
    data: {
      name: data.name,
      slug: slug + "-" + Date.now(),
      productCode: data.productCode,
      description: data.description,
      specifications: data.specifications,
      unit: data.unit,
      isFeatured: !!data.isFeatured,
      subCategoryId: Number(data.subCategoryId),
    },
  });
}

export async function updateProduct(id, data) {
  await prisma.product.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      productCode: data.productCode,
      description: data.description,
      specifications: data.specifications,
      unit: data.unit,
      isFeatured: !!data.isFeatured,
      isActive: data.isActive !== undefined ? !!data.isActive : undefined,
      subCategoryId: data.subCategoryId ? Number(data.subCategoryId) : undefined,
    },
  });
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function deleteProduct(id) {
  await prisma.product.delete({ where: { id: Number(id) } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function addProductImage(productCode, url, isMain = false) {
  return prisma.productImage.create({
    data: { productCode: Number(productCode), url, isMain },
  });
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
export async function getInstitutions() {
  return prisma.institutionType.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
}

export async function getCategories(institutionId) {
  return prisma.category.findMany({
    where: { isActive: true, ...(institutionId ? { institutionTypeId: Number(institutionId) } : {}) },
    include: { institutionType: true, _count: { select: { subcategories: true } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getSubCategories(categoryId) {
  return prisma.subCategory.findMany({
    where: { isActive: true, ...(categoryId ? { categoryId: Number(categoryId) } : {}) },
    include: { category: { include: { institutionType: true } }, _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createCategory(data) {
  return prisma.category.create({
    data: {
      name: data.name,
      slug: createSlug(data.name) + "-" + Date.now(),
      description: data.description,
      institutionTypeId: Number(data.institutionTypeId),
    },
  });
}

export async function updateCategory(id, data) {
  await prisma.category.update({ where: { id: Number(id) }, data: { name: data.name, description: data.description, isActive: data.isActive !== undefined ? !!data.isActive : undefined } });
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id) {
  await prisma.category.delete({ where: { id: Number(id) } });
  revalidatePath("/admin/categories");
}

export async function createSubCategory(data) {
  return prisma.subCategory.create({
    data: { name: data.name, slug: createSlug(data.name) + "-" + Date.now(), description: data.description, categoryId: Number(data.categoryId) },
  });
}

export async function updateSubCategory(id, data) {
  await prisma.subCategory.update({ where: { id: Number(id) }, data: { name: data.name, description: data.description, isActive: data.isActive !== undefined ? !!data.isActive : undefined } });
  revalidatePath("/admin/subcategories");
}

export async function deleteSubCategory(id) {
  await prisma.subCategory.delete({ where: { id: Number(id) } });
  revalidatePath("/admin/subcategories");
}

export async function createInstitution(data) {
  return prisma.institutionType.create({ data: { name: data.name, slug: createSlug(data.name) + "-" + Date.now(), description: data.description } });
}

export async function deleteInstitution(id) {
  await prisma.institutionType.delete({ where: { id: Number(id) } });
  revalidatePath("/admin/institutions");
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
export async function getTestimonials(featuredOnly = false) {
  return prisma.testimonial.findMany({
    where: { isActive: true, ...(featuredOnly ? { isFeatured: true } : {}) },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createTestimonial(data) {
  return prisma.testimonial.create({ data });
}

export async function updateTestimonial(id, data) {
  await prisma.testimonial.update({ where: { id: Number(id) }, data });
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id) {
  await prisma.testimonial.delete({ where: { id: Number(id) } });
  revalidatePath("/admin/testimonials");
}

// ─── BLOGS ───────────────────────────────────────────────────────────────────
export async function getBlogs(publishedOnly = true, limit = 10) {
  return prisma.blog.findMany({
    where: { ...(publishedOnly ? { isPublished: true } : {}) },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getBlogBySlug(slug) {
  return prisma.blog.findUnique({ where: { slug } });
}

export async function createBlog(data) {
  return prisma.blog.create({ data: { ...data, slug: createSlug(data.title) + "-" + Date.now() } });
}

export async function updateBlog(id, data) {
  await prisma.blog.update({ where: { id: Number(id) }, data });
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
}

export async function deleteBlog(id) {
  await prisma.blog.delete({ where: { id: Number(id) } });
  revalidatePath("/admin/blogs");
}

// ─── INQUIRIES ───────────────────────────────────────────────────────────────
export async function createInquiry(data) {
  return prisma.inquiry.create({ data });
}

export async function getInquiries(status) {
  return prisma.inquiry.findMany({
    where: { ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
  });
}

export async function markInquiryRead(id) {
  await prisma.inquiry.update({ where: { id: Number(id) }, data: { isRead: true } });
  revalidatePath("/admin/inquiries");
}

export async function updateInquiryStatus(id, status) {
  await prisma.inquiry.update({ where: { id: Number(id) }, data: { status } });
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiry(id) {
  await prisma.inquiry.delete({ where: { id: Number(id) } });
  revalidatePath("/admin/inquiries");
}

// ─── CERTIFICATIONS ──────────────────────────────────────────────────────────
export async function getCertifications() {
  return prisma.certification.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
}

export async function createCertification(data) {
  return prisma.certification.create({ data });
}

export async function updateCertification(id, data) {
  await prisma.certification.update({ where: { id: Number(id) }, data });
  revalidatePath("/admin/certifications");
}

export async function deleteCertification(id) {
  await prisma.certification.delete({ where: { id: Number(id) } });
  revalidatePath("/admin/certifications");
}

// ─── HERO SLIDES ─────────────────────────────────────────────────────────────
export async function getHeroSlides() {
  return prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
}

export async function createHeroSlide(data) {
  return prisma.heroSlide.create({ data });
}

export async function deleteHeroSlide(id) {
  await prisma.heroSlide.delete({ where: { id: Number(id) } });
  revalidatePath("/admin");
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
export async function getSettings() {
  const settings = await prisma.setting.findMany();
  return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
}

export async function updateSetting(key, value) {
  await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
}

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const [totalProducts, totalCategories, totalInquiries, totalTestimonials, featuredProducts, recentInquiries, unreadInquiries] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.inquiry.count(),
    prisma.testimonial.count(),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.inquiry.count({ where: { isRead: false } }),
  ]);
  return { totalProducts, totalCategories, totalInquiries, totalTestimonials, featuredProducts, recentInquiries, unreadInquiries };
}