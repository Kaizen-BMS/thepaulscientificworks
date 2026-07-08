'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

 
const testimonials = [
  {
    name: 'Science Department',
    title: 'Educational Institution',
    text: 'Reliable supplier with professional customer support and durable scientific products.',
    rating: 5,
  },
  {
    name: 'Nursing College',
    title: 'Healthcare Education Institute',
    text: 'Our nursing lab setup was completed smoothly with quality equipment and fast service.',
    rating: 5,
  },
  {
    name: 'Government Institution',
    title: 'Public Educational Organization',
    text: 'Trusted manufacturer for educational and scientific laboratory solutions.',
    rating: 5,
  },
  {
    name: 'Research Laboratory',
    title: 'Scientific Research Center',
    text: 'We appreciate the quality standards and responsive support provided by the company.',
    rating: 5,
  },
  {
    name: 'CBSE School',
    title: 'Senior Secondary Institution',
    text: 'Affordable pricing with excellent build quality for school laboratory equipment.',
    rating: 5,
  },
];



  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

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
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            variants={itemVariants}
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            className="text-lg text-slate-400 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Trusted by leading institutions and healthcare sectors across India
          </motion.p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Main testimonial */}
          <motion.div
            key={activeIndex}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 sm:p-12 border border-blue-500/20 min-h-96"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Stars */}
            <div className="flex space-x-1 mb-6">
              {Array.from({ length: testimonials[activeIndex].rating }).map(
                (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                )
              )}
            </div>

            {/* Quote */}
            <blockquote className="text-lg sm:text-xl font-semibold mb-6 leading-relaxed">
              "{testimonials[activeIndex].text}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center space-x-4">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-blue-400 to-slate-600 rounded-full flex items-center justify-center text-2xl font-bold"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity }}
              >
                {testimonials[activeIndex].name.charAt(0)}
              </motion.div>
              <div>
                <p className="font-bold text-lg">
                  {testimonials[activeIndex].name}
                </p>
                <p className="text-slate-400 text-sm">
                  {testimonials[activeIndex].title}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Navigation buttons */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all ${
                  index === activeIndex
                    ? 'w-8 bg-blue-500'
                    : 'w-3 bg-slate-600 hover:bg-slate-500'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-6 text-slate-400 text-sm">
            {activeIndex + 1} / {testimonials.length}
          </div>
        </div>

        {/* Stats */}
       
      </div>
    </section>
  );
}
