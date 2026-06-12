"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getCategoryIcon } from "@/lib/categoryIcons";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function CategoryCards() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetch("/api/categories?counts=true")
      .then(r => r.json())
      .then(d => setCategories(d.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

 const handleCategoryClick = (catId) => {
  router.push(`/products?category=${catId}`);
};

  if (loading) {
    return (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-5 w-36 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-3 animate-pulse" />
            <div className="h-9 w-60 bg-slate-200 dark:bg-slate-700 rounded-xl mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-1.5">
            Product Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Explore Our Catalogue
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Comprehensive scientific and educational equipment across {categories.length} specialized categories.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {categories.map((cat) => {
            const Icon     = getCategoryIcon(cat.icon);
            const gradient = cat.gradient || "from-blue-500 to-blue-700";
            return (
              <motion.div key={cat.id} variants={itemVariants}>
                <motion.div
                  onClick={() => handleCategoryClick(cat.id)}
                  whileHover={{ y: -4, boxShadow: "0 12px 32px -8px rgba(0,0,0,0.12)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-colors relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full px-2 py-0.5">
                      {cat.count ?? 0} items
                    </span>
                  </div>

                  <h3 className="text-[13.5px] font-bold text-slate-900 dark:text-white mb-1.5 leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse <span className="text-base leading-none">→</span>
                  </div>

                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => router.push("/products")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 text-white font-semibold px-7 py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
          >
            View Full Catalogue →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}