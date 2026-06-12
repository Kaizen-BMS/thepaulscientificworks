"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

function formatDate(str) {
  if (!str) return "";
  try {
    return new Date(str).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return str; }
}

export default function BlogPageClient({ blogs }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", ...Array.from(new Set(blogs.map(b => b.category).filter(Boolean)))];
  const featured   = blogs.filter(b => b.featured);
  const filtered   = activeCategory === "all"
    ? blogs
    : blogs.filter(b => b.category === activeCategory);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/10 to-slate-700/10 dark:from-blue-900/20 dark:to-slate-800/20 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Blog & Resources
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Insights, updates, and resources for scientific education and healthcare
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Featured */}
        {featured.length > 0 && (
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Featured Articles</h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              {featured.slice(0, 2).map(blog => (
                <motion.div
                  key={blog.id} variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all group"
                >
                  <Link href={`/blog/${blog.slug}`}>
                    <div className="relative h-52 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 overflow-hidden">
                      <Image
                        src={blog.image || "/blogs/placeholder.jpg"} alt={blog.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      {blog.category && (
                        <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-blue-600 rounded-full px-2.5 py-1">
                          {blog.category}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-4 mb-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(blog.createdAt)}</span>
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{blog.author}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{blog.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                      <motion.span whileHover={{ x: 4 }} className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        Read More <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              {cat === "all" ? "All" : cat}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          {filtered.map(blog => (
            <motion.div
              key={blog.id} variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all group"
            >
              <Link href={`/blog/${blog.slug}`}>
                <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600">
                  <Image
                    src={blog.image || "/blogs/placeholder.jpg"} alt={blog.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw" loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{formatDate(blog.createdAt)}</span>
                    {blog.category && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-2 py-0.5">
                        <Tag className="w-2.5 h-2.5" />{blog.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 text-sm">{blog.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{blog.excerpt}</p>
                  <motion.span whileHover={{ x: 2 }} className="text-blue-600 dark:text-blue-400 font-semibold text-xs inline-flex items-center gap-1">
                    Read <ArrowRight className="w-3 h-3" />
                  </motion.span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-sm">No blog posts in this category yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}