export const categories = [
  {
    id: "biology",
    name: "Biology",
    slug: "biology",
    description:
      "Provides microscopes, anatomical models & simulators, educational charts & boards, laboratory instruments, consumables, and school educational products for biological sciences education.",
    icon: "🔬",
    color: "emerald",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    slug: "chemistry",
    description:
      "Contains chemistry glassware, laboratory instruments & equipment, educational charts & boards, consumables, models, and school educational products for chemistry practicals.",
    icon: "⚗️",
    color: "blue",
  },
  {
    id: "physics",
    name: "Physics",
    slug: "physics",
    description:
      "Includes laboratory apparatus, educational charts & boards, scientific instruments & equipment, consumables, models & simulators, and school educational products for physics education.",
    icon: "⚡",
    color: "cyan",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    slug: "mathematics",
    description:
      "Includes geometrical models, educational charts & boards, activity kits, measuring instruments, and school educational products for conceptual mathematics learning.",
    icon: "📐",
    color: "violet",
  },
  {
    id: "geography",
    name: "Geography",
    slug: "geography",
    description:
      "Includes globes, maps, landform models, educational charts & boards, laboratory instruments, consumables, and school educational products for geography education.",
    icon: "🌍",
    color: "amber",
  },
  {
    id: "midwifery-nursing",
    name: "Midwifery and Nursing",
    slug: "midwifery-nursing",
    description:
      "Covers patient-care simulators, medical models, maternal healthcare models, educational charts & boards, laboratory instruments & equipment, and healthcare education products.",
    icon: "🏥",
    color: "rose",
  },
  {
    id: "pre-clinical-sciences",
    name: "Pre-Clinical Sciences",
    slug: "pre-clinical-sciences",
    description:
      "Includes medical models & simulators, scientific instruments & equipment, educational charts & boards, consumables, and school educational products for anatomy and medical sciences.",
    icon: "🩺",
    color: "indigo",
  },
  {
    id: "laboratory-equipment",
    name: "Laboratory Equipment",
    slug: "laboratory-equipment",
    description:
      "Precision laboratory glass products including flasks, test tubes, burettes, measuring cylinders, plasticware, and general lab instruments for scientific experimentation.",
    icon: "🧪",
    color: "teal",
  },
];

export function getCategoryById(id) {
  return categories.find((c) => c.id === id) || null;
}

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug) || null;
}