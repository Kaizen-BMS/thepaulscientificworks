'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Home, Search, Package } from 'lucide-react';

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center pt-20 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 404 Number */}
          <motion.div
            variants={itemVariants}
            className="text-9xl sm:text-[10rem] font-bold text-slate-900 dark:text-white opacity-20"
          >
            404
          </motion.div>

          {/* Error Icon */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-5xl">🔍</span>
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
              Page Not Found
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6"
          >
            <Link href="/">
              <motion.button
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-slate-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </motion.button>
            </Link>

            <Link href="/products">
              <motion.button
                className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Package className="w-5 h-5" />
                <span>Browse Products</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 text-left"
          >
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
              What you can do:
            </h3>
            <ul className="space-y-2">
              {[
                { icon: Home, text: 'Visit our homepage for featured products' },
                { icon: Package, text: 'Browse our complete product catalog' },
                { icon: Search, text: 'Use search to find what you need' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={idx}
                    className="flex items-center space-x-3 text-slate-600 dark:text-slate-400"
                    whileHover={{ x: 4 }}
                  >
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span>{item.text}</span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* Support Message */}
          <motion.div
            variants={itemVariants}
            className="text-sm text-slate-600 dark:text-slate-400"
          >
            <p>Need help? <Link href="/contact" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Contact our support team</Link></p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}