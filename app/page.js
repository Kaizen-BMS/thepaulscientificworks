'use client';

import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import CategoryCards from '@/components/CategoryCards';
import Testimonials from '@/components/Testimonials';

import Link from 'next/link';

export default function Home() {
 

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

     

      {/* Category Cards Section */}
      <CategoryCards />

      {/* Network Section */}
     
      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Ready to Upgrade Your Facility?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Contact us today for customized scientific and educational equipment solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-slate-700 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Products
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-bold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get in Touch
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
