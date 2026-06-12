'use client';

import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import CategoryCards from '@/components/CategoryCards';
import Testimonials from '@/components/Testimonials';
import { CheckCircle, Zap, Shield, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const processSteps = [
    {
      icon: CheckCircle,
      title: 'Requirement Assessment',
      description: 'We understand your specific scientific and educational needs',
    },
    {
      icon: Zap,
      title: 'Custom Solutions',
      description: 'Design tailored instruments and equipment packages',
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Rigorous testing ensures premium international standards',
    },
    {
      icon: BarChart3,
      title: 'Timely Delivery',
      description: 'Efficient logistics and professional project management',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Process Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl"
            animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Our Process
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              From requirement assessment to delivery, we ensure excellence at every step
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {processSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                >
                  <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                    {/* Step number */}
                    <motion.div
                      className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4"
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        Step {idx + 1}
                      </span>
                    </motion.div>

                    {/* Icon */}
                    <motion.div
                      className="w-14 h-14 bg-gradient-to-br from-blue-500 to-slate-600 rounded-xl flex items-center justify-center mb-4"
                      animate={{ rotate: [0, 5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>

                    {/* Connector line */}
                    {idx < processSteps.length - 1 && (
                      <motion.div
                        className="hidden lg:block absolute top-1/2 right-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-transparent"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ delay: idx * 0.2, duration: 0.6 }}
                        viewport={{ once: true }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Category Cards Section */}
      <CategoryCards />

      {/* Network Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Network</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Serving Government Departments, Educational Institutions & Healthcare Sectors Across India
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {[
              { label: 'Institutions', value: '1000+' },
              { label: 'Government Contracts', value: '500+' },
              { label: 'No. of Certificates', value: '25+' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center p-8 bg-gradient-to-br from-blue-500/10 to-slate-600/10 rounded-2xl border border-blue-500/20"
                whileHover={{ scale: 1.05 }}
              >
                <motion.p
                  className="text-4xl sm:text-5xl font-bold text-blue-400 mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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