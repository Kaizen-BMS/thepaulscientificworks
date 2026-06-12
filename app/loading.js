'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  const skeletonVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 0%'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
      {/* Header Skeleton */}
      <motion.div
        className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700"
        variants={skeletonVariants}
        animate="animate"
        style={{
          backgroundSize: '200% 100%',
        }}
      >
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-12 w-3/4 bg-slate-300 dark:bg-slate-600 rounded-lg"></div>
          <div className="h-6 w-full bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        </div>
      </motion.div>

      {/* Content Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <motion.div
              key={idx}
              className="space-y-4"
              variants={itemVariants}
            >
              {/* Image Skeleton */}
              <motion.div
                className="w-full aspect-square bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl"
                variants={skeletonVariants}
                animate="animate"
                style={{
                  backgroundSize: '200% 100%',
                }}
              ></motion.div>

              {/* Content Skeleton */}
              <motion.div
                className="h-4 w-3/4 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-lg"
                variants={skeletonVariants}
                animate="animate"
                style={{
                  backgroundSize: '200% 100%',
                }}
              ></motion.div>

              <motion.div
                className="h-6 w-full bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg"
                variants={skeletonVariants}
                animate="animate"
                style={{
                  backgroundSize: '200% 100%',
                }}
              ></motion.div>

              <motion.div
                className="h-4 w-2/3 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-lg"
                variants={skeletonVariants}
                animate="animate"
                style={{
                  backgroundSize: '200% 100%',
                }}
              ></motion.div>

              {/* Button Skeleton */}
              <motion.div
                className="h-10 w-full bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg"
                variants={skeletonVariants}
                animate="animate"
                style={{
                  backgroundSize: '200% 100%',
                }}
              ></motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="flex items-center justify-center space-x-2">
          <motion.div
            className="w-3 h-3 bg-blue-600 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="w-3 h-3 bg-blue-600 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-3 h-3 bg-blue-600 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
        <p className="text-slate-600 dark:text-slate-400 mt-4 font-semibold">
          Loading amazing products...
        </p>
      </motion.div>
    </div>
  );
}