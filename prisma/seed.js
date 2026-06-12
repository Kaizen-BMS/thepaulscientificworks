
// prisma/seed.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  console.log("🌱 Seeding database...");

  // ======================================================
  // CLEAR OLD DATA
  // ======================================================

  await prisma.productImage.deleteMany();
  await prisma.productPdf.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.institutionType.deleteMany();

  // ======================================================
  // INSTITUTION TYPE
  // ======================================================

  const institution = await prisma.institutionType.create({
    data: {
      name: "Educational Institutions",
      slug: "educational-institutions",
      description:
        "Scientific and educational laboratory equipment supplier",
      isActive: true,
    },
  });

  // ======================================================
  // CATEGORIES
  // ======================================================

  const categories = [
    {
      name: "Biology",
      slug: "biology",
      prefix: "BIO",
      count: 10,
    },
    {
      name: "Mathematics",
      slug: "mathematics",
      prefix: "MAT",
      count: 20,
    },
    {
      name: "Physics",
      slug: "physics",
      prefix: "PHY",
      count: 10,
    },
    {
      name: "Midwifery and Nursing",
      slug: "midwifery-and-nursing",
      prefix: "MNL",
      count: 20,
    },
    {
      name: "Laboratory Glassware and Plasticware",
      slug: "laboratory-glassware-and-plasticware",
      prefix: "GLS",
      count: 20,
    },
    {
      name: "Geography",
      slug: "geography",
      prefix: "GEO",
      count: 20,
    },
    {
      name: "Chemistry",
      slug: "chemistry",
      prefix: "CHE",
      count: 10,
    },
    {
      name: "Pre Clinical Sciences",
      slug: "pre-clinical-sciences",
      prefix: "PCS",
      count: 10,
    },
  ];

  const categoryMap = {};

  // ======================================================
  // CREATE CATEGORIES
  // ======================================================

  for (const cat of categories) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: `${cat.name} educational laboratory products`,
        institutionTypeId: institution.id,
        showOnHome: true,
        isActive: true,
      },
    });

    categoryMap[cat.prefix] = category;
  }

  // ======================================================
  // PRODUCT ARRAYS
  // ======================================================

  const products = [];

  // ======================================================
  // BIOLOGY
  // ======================================================

  const biologyProducts = [
    "Skeleton Model",
    "Eye Model",
    "Skin Model",
    "Shoulder Joint Model",
    "Male Muscular Figure",
    "Mini Torso",
    "Reproductive System Model",
    "Human Brain Model",
    "Digestive System Model",
    "Biology Charts Set",
  ];

  biologyProducts.forEach((name, index) => {
    products.push({
      productCode: `BIO-${String(index + 1).padStart(3, "0")}`,
      name,
      category: "BIO",
      description: `${name} for biology educational laboratory demonstrations.`,
    });
  });

  // ======================================================
  // CHEMISTRY
  // ======================================================

  const chemistryProducts = [
    "Cork Borer German Pattern",
    "Spirit Lamp Aluminium",
    "Gas Taps",
    "Crucible with Lid",
    "Burette Clamp",
    "Bunsen Burner",
    "Dial Type Thermometer",
    "Wall Thermometer",
    "Tripod Stand",
    "Test Tube Stand",
  ];

  chemistryProducts.forEach((name, index) => {
    products.push({
      productCode: `CHE-${String(index + 1).padStart(3, "0")}`,
      name,
      category: "CHE",
      description: `${name} for chemistry laboratory applications.`,
    });
  });

  // ======================================================
  // PHYSICS
  // ======================================================

  const physicsProducts = [
    "Newton Colour Disc",
    "Friction Board Apparatus",
    "Optical Bench",
    "Rheostats",
    "Spectrometer",
    "Meter Bridge",
    "Resistance Box",
    "Potentiometer",
    "Ripple Tank",
    "Flywheel",
  ];

  physicsProducts.forEach((name, index) => {
    products.push({
      productCode: `PHY-${String(index + 1).padStart(3, "0")}`,
      name,
      category: "PHY",
      description: `${name} for physics laboratory experiments.`,
    });
  });

  // ======================================================
  // AUTO GENERATED PRODUCTS
  // ======================================================

  const autoCategories = categories.filter(
    (c) => !["BIO", "CHE", "PHY"].includes(c.prefix)
  );

  for (const cat of autoCategories) {
    for (let i = 1; i <= cat.count; i++) {
      products.push({
        productCode: `${cat.prefix}-${String(i).padStart(3, "0")}`,
        name: `${cat.name} Product ${i}`,
        category: cat.prefix,
        description: `${cat.name} educational laboratory product ${i}.`,
      });
    }
  }

  // ======================================================
  // CREATE PRODUCTS
  // ======================================================

  for (const item of products) {
    const slug = slugify(`${item.name}-${item.productCode}`);

    const product = await prisma.product.create({
      data: {
        productCode: item.productCode,

        name: item.name,

        slug,

        shortDescription: item.description,

        description: item.description,

        specifications: JSON.stringify({
          material: "High Quality",
          usage: "Educational & Laboratory",
          warranty: "1 Year",
        }),

        featuredImage: `/products/${item.productCode}.png`,

        categoryId: categoryMap[item.category].id,

        isFeatured: true,

        showOnHome: true,

        isActive: true,

        metaTitle: item.name,

        metaDescription: item.description,

        order: 0,
      },
    });

    // ======================================================
    // PRODUCT IMAGE
    // ======================================================

    await prisma.productImage.create({
      data: {
        productCode: product.id,
        url: `/products/${item.productCode}.png`,
        alt: item.name,
        order: 0,
      },
    });
  }

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
