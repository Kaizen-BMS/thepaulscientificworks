'use client';

import { motion } from 'framer-motion';
import { Eye, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProductCard({ product, index }) {
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.6 },
    },
  };

  return (
    <motion.div
      className="h-full"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
        {/* Image Container */}
        <div className="relative h-64 sm:h-72 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600">
          <motion.div
            className="w-full h-full flex items-center justify-center"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center">
              <motion.div
                className="w-24 h-24 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-slate-600 rounded-lg flex items-center justify-center"
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-white text-4xl font-bold">
                  {product.name.charAt(0)}
                </span>
              </motion.div>
              <p className="text-slate-600 dark:text-slate-300 font-semibold">
                {product.category}
              </p>
            </div>
          </motion.div>

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col">
          <div className="mb-4 flex-1">
            <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              {product.category}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
              {product.description}
            </p>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              ID: {product.id}
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Link href={`/products/${product.id}`}>
              <motion.button
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="w-4 h-4" />
                <span>Quick View</span>
              </motion.button>
            </Link>
            <motion.button
              className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-semibold rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Inquire</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}