'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+91-9813356463', '+91-9813196763', '+91-8295519908'],
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['paulscientificworkssagar@gmail.com'],
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: MapPin,
      title: 'Location',
      details: ['Ambala Cantt, Haryana', 'India - 133001'],
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
      color: 'from-green-500 to-green-600',
    },
  ];

  const offices = [
    {
      type: 'Registered Office',
      address: '#2104, Kacha Bazar, Ambala Cantt, Haryana – 133001',
      phone: '+91-9813356463',
      email: 'paulscientificworkssagar@gmail.com',
    },
    {
      type: 'Manufacturing Facility',
      address: '#948, Ori Choudhary Ki Mandi, Ambala Cantt – 133001',
      phone: '+91-9813196763',
      email: 'paulscientificworkssagar@gmail.com',
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
    <main className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/10 to-slate-700/10 dark:from-blue-900/20 dark:to-slate-800/20 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Get in Touch
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Contact us anytime and our team will get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Methods */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {contactMethods.map((method, idx) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className={`w-14 h-14 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-4`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">
                  {method.title}
                </h3>
                <div className="space-y-2">
                  {method.details.map((detail, i) => (
                    <p
                      key={i}
                      className="text-slate-600 dark:text-slate-400 text-sm"
                    >
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Send us a Message
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Fill out the form below and we'll respond promptly
              </p>
              <ContactForm />
            </div>
          </motion.div>

          {/* Quick Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Offices */}
            <div className="space-y-4">
              {offices.map((office, idx) => (
                <motion.div
                  key={idx}
                  className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-blue-200 dark:border-slate-700"
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">
                    {office.type}
                  </h3>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 mt-1 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <p>{office.address}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <a href={`tel:${office.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <a href={`mailto:${office.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                        {office.email}
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Contact Buttons */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="https://wa.me/919813356463"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full px-6 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp Us</span>
              </motion.a>

              <motion.a
                href="tel:+919813356463"
                className="flex items-center justify-center space-x-2 w-full px-6 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone className="w-5 h-5" />
                <span>Call Us</span>
              </motion.a>

              <motion.a
                href="mailto:labs@PaulScientificWorks.com"
                className="flex items-center justify-center space-x-2 w-full px-6 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail className="w-5 h-5" />
                <span>Email Us</span>
              </motion.a>
            </motion.div>

            {/* FAQ Note */}
            <motion.div
              className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                Quick Response
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                We typically respond to inquiries within 24 hours. For urgent matters, call us directly.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8">
            Visit Our Facility
          </h2>
          <div className="relative w-full h-96 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-600">
        <iframe
  src="https://www.google.com/maps?q=Paul+Scientific+Works+Ambala+Cantt&z=17&output=embed"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>

          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                q: 'What are your payment terms?',
                a: 'We offer flexible payment terms including advance payment, net payment, and installment options for bulk orders.',
              },
              {
                q: 'Do you provide installation services?',
                a: 'Yes, we provide professional installation services for most of our products. Contact us for details.',
              },
              {
                q: 'What is your warranty policy?',
                a: 'We provide 1-2 years warranty on most products depending on the category. Extended warranty is available.',
              },
              {
                q: 'Can you customize products?',
                a: 'Yes, we offer customization for institutional and government orders. Contact our team for specific requirements.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
              >
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
}