'use client';

import { motion } from 'framer-motion';
import Timeline from '@/components/Timeline';
import { Award, Target, Heart, Users, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';

import {
  Autoplay,
  Pagination,
  Navigation
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function AboutPage() {
  const companyValues = [
    {
      icon: Award,
      title: 'Quality',
      description: 'Rigorous testing and premium materials ensure excellence',
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'Honest dealings and transparent business practices',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Continuous improvement and modern solutions',
    },
    {
      icon: Target,
      title: 'Commitment',
      description: 'Dedicated to customer success and satisfaction',
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: 'Your needs drive our product development',
    },
    {
      icon: Shield,
      title: 'Professional Service',
      description: 'Expert support and timely assistance',
    },
  ];

  const whyChooseUs = [
    'ISO 9001:2015 Certified Company',
    'Trusted Manufacturer & Exporter',
    'Quality Tested Scientific & Medical Equipment',
    'Experienced in Government & Institutional Supplies',
    'Competitive Pricing & Timely Delivery',
    'Professional Customer Support',
    'Domestic & International Supply Capability',
  ];

const leadership = [
  {
    name: 'Mr. Harpal Sagar',
    title: 'Founder & Director',
    image: '/harpal-sagar.png',
  },
  {
    name: 'Mrs. Sunita Pal',
    title: 'Operations Manager',
    image: '/sunita-pal.png',
  },
  {
    name: 'Mrs. Mamta Rani',
    title: 'Product Development Head',
    image: '/mamta-rani.png',
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


  const certificates = [
  {
    title: 'ISO 9001:2015',
    description: 'Quality Management Certification',
    image: '/certificates/previews/iso-9001.png',
    pdf: '/certificates/iso-9001-2015.pdf',
  },

  {
    title: 'FIEO Registration',
    description: 'Export Organization Membership',
    image: '/certificates/previews/fieo.png',
    pdf: '/certificates/fieo-certificate.pdf',
  },

  {
    title: 'GST Registration',
    description: 'Government Tax Registration',
    image: '/certificates/previews/gst.png',
    pdf: '/certificates/gst-certificate.pdf',
  },

  {
    title: 'Trademark Certificate',
    description: 'Brand Protection Certification',
    image: '/certificates/previews/trademark.png',
    pdf: '/certificates/trademark-certificate.pdf',
  },
  {
    title: 'Udyam Certificate',
    description: 'Brand Protection Certification',
    image: '/certificates/previews/udyam.png',
    pdf: '/certificates/udyam-registration.pdf',
  },
]

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 relative overflow-hidden">
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

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent">
              Paul Scientific Works
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Three Decades of Innovation, Quality & Trust in Scientific Education & Healthcare
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Profile */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Who We Are
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Paul Scientific Works, based in Ambala Cantt, Haryana, is an ISO 9001:2015
                Certified Manufacturer and Exporter engaged in the manufacturing and supply of
                Scientific, Laboratory and Medical Instruments. With over 36 years of excellence,
                we have become a trusted partner for educational institutions, government
                departments, and healthcare facilities across India and internationally.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-blue-200 dark:border-slate-700"
                whileHover={{ y: -8 }}
              >
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Our Mission
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  To deliver reliable, innovative and quality Scientific, Educational & Medical
                  Equipment solutions that support learning, research and healthcare excellence.
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-green-50 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-green-200 dark:border-slate-700"
                whileHover={{ y: -8 }}
              >
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Our Vision
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  To become a trusted global name in Scientific & Laboratory Equipment through
                  quality manufacturing, customer satisfaction and continuous growth.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              The principles that guide our every decision and action
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {companyValues.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                  whileHover={{ y: -8 }}
                >
                  <motion.div
                    className="w-14 h-14 bg-gradient-to-br from-blue-500 to-slate-600 rounded-xl flex items-center justify-center mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose Paul Scientific Works
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {whyChooseUs.map((reason, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex items-start space-x-4 p-6 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-blue-200 dark:border-slate-700"
                whileHover={{ x: 4 }}
              >
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl mt-1">
                  ✓
                </span>
                <span className="text-slate-900 dark:text-white font-semibold">
                  {reason}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <Timeline />

      {/* Leadership Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Our Leadership
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Experienced professionals dedicated to excellence
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {leadership.map((leader, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
               className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                whileHover={{ y: -8 }}
              >
                <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
  <img
    src={leader.image}
    alt={leader.name}
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
  />
</div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 font-semibold">
                    {leader.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>





      {/* Certifications */}
     <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-black relative overflow-hidden">

  <div className="absolute inset-0">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full" />
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-4">

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-20"
    >
      <h2 className="text-5xl font-bold text-white mb-6">
        Certifications & Recognition
      </h2>

      <p className="text-slate-400 text-xl max-w-3xl mx-auto">
        Trusted by institutions, government organizations and international clients.
      </p>
    </motion.div>

    <Swiper
  modules={[Autoplay, Pagination, Navigation]}
  spaceBetween={30}
  slidesPerView={1}

  autoplay={{
    delay: 3000,
    disableOnInteraction: false,
  }}

  loop={true}

  pagination={{
    clickable: true,
  }}

  navigation={true}

  breakpoints={{
    640: {
      slidesPerView: 2,
    },

    1024: {
      slidesPerView: 3,
    },

    1280: {
      slidesPerView: 4,
    },
  }}

  className="pb-16"
>

      {certificates.map((cert, index) => (

  <SwiperSlide key={index}>

        <motion.a
          key={index}
          href={cert.pdf}
          target="_blank"
          rel="noopener noreferrer"

          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}

          whileHover={{
            y: -15,
            scale: 1.03,
          }}

          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl"
        >

          <div className="relative aspect-[3/4] overflow-hidden">

            <img
              src={cert.image}
              alt={cert.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">
              VERIFIED
            </div>

          </div>

          <div className="p-6">

            <h3 className="text-2xl font-bold text-white mb-2">
              {cert.title}
            </h3>

            <p className="text-slate-400 mb-5">
              {cert.description}
            </p>

            <div className="flex items-center justify-between">

              <span className="text-cyan-400 font-semibold group-hover:text-cyan-300 transition">
                View Certificate
              </span>

              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500 transition">
                →
              </div>

            </div>

          </div>

       </motion.a>

  </SwiperSlide>

      ))}

    </Swiper>

  </div>

</section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Partner With Us?
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Contact us today to discuss your requirements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-slate-700 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Products
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  className="px-8 py-4 border-2 border-blue-400 text-blue-400 font-bold rounded-lg hover:bg-blue-900/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
