// lib/prisma.js

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['info'] : [],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Product queries
export const productQueries = {
  // Get all products with filters
  async getProducts(filters = {}) {
    const {
      institutionTypeSlug,
      categorySlug,
      subCategorySlug,
      search,
      featured,
      limit = 20,
      skip = 0,
      sort = 'latest',
    } = filters;

    const where = {};

    if (institutionTypeSlug) {
      where.institutionType = { slug: institutionTypeSlug };
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (subCategorySlug) {
      where.subCategory = { slug: subCategorySlug };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { productCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    const orderBy = {};
    switch (sort) {
      case 'latest':
        orderBy.createdAt = 'desc';
        break;
      case 'name-asc':
        orderBy.name = 'asc';
        break;
      case 'name-desc':
        orderBy.name = 'desc';
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          institutionType: true,
          category: true,
          subCategory: true,
        },
        orderBy,
        take: limit,
        skip,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      pages: Math.ceil(total / limit),
    };
  },

  // Get product by slug with full details
  async getProductBySlug(slug) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        institutionType: true,
        category: true,
        subCategory: true,
        inquiries: {
          select: {
            id: true,
            createdAt: true,
          },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (product) {
      // Increment view count
      await prisma.product.update({
        where: { id: product.id },
        data: { views: { increment: 1 } },
      });

      // Parse JSON fields
      if (product.specifications) {
        product.specifications = JSON.parse(product.specifications);
      }
      if (product.galleryImages) {
        product.galleryImages = JSON.parse(product.galleryImages);
      }
    }

    return product;
  },

  // Get featured products
  async getFeaturedProducts(limit = 6) {
    return prisma.product.findMany({
      where: { featured: true },
      include: {
        institutionType: true,
        category: true,
        subCategory: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  },

  // Get related products
  async getRelatedProducts(productCode, limit = 4) {
    const product = await prisma.product.findUnique({
      where: { id: productCode },
      select: {
        categoryId: true,
        subCategoryId: true,
      },
    });

    if (!product) return [];

    return prisma.product.findMany({
      where: {
        AND: [
          { id: { not: productCode } },
          {
            OR: [
              { categoryId: product.categoryId },
              { subCategoryId: product.subCategoryId },
            ],
          },
        ],
      },
      include: {
        institutionType: true,
        category: true,
        subCategory: true,
      },
      take: limit,
    });
  },

  // Get products by institution type
  async getProductsByInstitutionType(slug, limit = 20, skip = 0) {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          institutionType: { slug },
        },
        include: {
          institutionType: true,
          category: true,
          subCategory: true,
        },
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({
        where: { institutionType: { slug } },
      }),
    ]);

    return { products, total, pages: Math.ceil(total / limit) };
  },

  // Get products by category
  async getProductsByCategory(slug, limit = 20, skip = 0) {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { category: { slug } },
        include: {
          institutionType: true,
          category: true,
          subCategory: true,
        },
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where: { category: { slug } } }),
    ]);

    return { products, total, pages: Math.ceil(total / limit) };
  },

  // Get products by subcategory
  async getProductsBySubCategory(slug, limit = 20, skip = 0) {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { subCategory: { slug } },
        include: {
          institutionType: true,
          category: true,
          subCategory: true,
        },
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where: { subCategory: { slug } } }),
    ]);

    return { products, total, pages: Math.ceil(total / limit) };
  },
};

// Institution Type queries
export const institutionQueries = {
  async getAll() {
    return prisma.institutionType.findMany({
      include: {
        _count: {
          select: { products: true, categories: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  },

  async getBySlug(slug) {
    return prisma.institutionType.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            _count: { select: { products: true } },
          },
        },
      },
    });
  },
};

// Category queries
export const categoryQueries = {
  async getByInstitutionType(institutionTypeSlug) {
    return prisma.category.findMany({
      where: {
        institutionType: { slug: institutionTypeSlug },
      },
      include: {
        subCategories: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  },

  async getBySlug(slug) {
    return prisma.category.findFirst({
      where: { slug },
      include: {
        institutionType: true,
        subCategories: true,
      },
    });
  },
};

// Blog queries
export const blogQueries = {
  async getPublished(limit = 10, skip = 0) {
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: { published: true },
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blog.count({ where: { published: true } }),
    ]);

    return { blogs, total, pages: Math.ceil(total / limit) };
  },

  async getBySlug(slug) {
    return prisma.blog.findUnique({
      where: { slug },
    });
  },

  async getFeatured(limit = 3) {
    return prisma.blog.findMany({
      where: { published: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  },
};

// Inquiry queries
export const inquiryQueries = {
  async create(data) {
    return prisma.inquiry.create({
      data,
      include: { product: true },
    });
  },

  async getAll(limit = 50, skip = 0) {
    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        include: { product: true },
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.inquiry.count(),
    ]);

    return { inquiries, total };
  },

  async getByStatus(status, limit = 50, skip = 0) {
    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where: { status },
        include: { product: true },
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.inquiry.count({ where: { status } }),
    ]);

    return { inquiries, total };
  },
};

// Statistics queries
export const statisticsQueries = {
  async getOverall() {
    const [productCount, categoryCount, institutionCount, inquiryCount] =
      await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.institutionType.count(),
        prisma.inquiry.count(),
      ]);

    return {
      products: productCount,
      categories: categoryCount,
      institutions: institutionCount,
      inquiries: inquiryCount,
    };
  },

  async getProductStats() {
    const featured = await prisma.product.count({ where: { featured: true } });
    const inStock = await prisma.product.count({
      where: { stockStatus: 'in_stock' },
    });
    const lowStock = await prisma.product.count({
      where: { stockStatus: 'low_stock' },
    });

    return { featured, inStock, lowStock };
  },

  async getTopProducts(limit = 10) {
    return prisma.product.findMany({
      orderBy: { views: 'desc' },
      take: limit,
      include: {
        institutionType: true,
        category: true,
      },
    });
  },
};

// Search functionality
export const searchQueries = {
  async searchProducts(query, limit = 20) {
    return prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { shortDescription: { contains: query, mode: 'insensitive' } },
          { fullDescription: { contains: query, mode: 'insensitive' } },
          { productCode: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        institutionType: true,
        category: true,
        subCategory: true,
      },
      take: limit,
    });
  },

  async searchBlogs(query, limit = 10) {
    return prisma.blog.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
    });
  },
};

export default prisma;