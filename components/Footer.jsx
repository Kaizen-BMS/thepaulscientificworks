'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaYoutube, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { motion } from 'framer-motion';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Contact', href: '/contact' },
];

const categoryLinks = [
  { label: 'Biology', href: '/products?category=biology' },
  { label: 'Chemistry', href: '/products?category=chemistry' },
  { label: 'Physics', href: '/products?category=physics' },
  { label: 'Midwifery & Nursing', href: '/products?category=midwifery-nursing' },
  { label: 'Pre-Clinical Sciences', href: '/products?category=pre-clinical-sciences' },
  { label: 'Lab Glassware', href: '/products?category=laboratory-glassware' },
];

const socialLinks = [
  {
    icon: FaYoutube,
    href: 'https://youtube.com/shorts/3d1Vafy_R38?si=-5UWzydXJJukdRJM',
    label: 'YouTube',
    color: 'hover:text-red-400',
  },
  {
    icon: FaInstagram,
    href: 'https://www.instagram.com/paul_scientificworks',
    label: 'Instagram',
    color: 'hover:text-pink-400',
  },
  {
    icon: FaFacebookF,
    href: 'https://www.facebook.com/share/18kFbuDhSV/',
    label: 'Facebook',
    color: 'hover:text-blue-400',
  },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Subtle background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-b border-slate-700/60">

          {/* Col 1: Logo + Info */}
          <div className="lg:col-span-1 ">
            <Link href="/">
              <motion.div whileHover={{ scale: 1.02 }} className="inline-block mb-4 cursor-pointer ">
                <img
                  src="/image.png"
                  alt="Paul Scientific Works"
                  className="h-16 w-auto object-contain drop-shadow rounded-2xl"
                />
              </motion.div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              ISO 9001:2015 Certified Manufacturer & Exporter of Scientific, Laboratory and Medical Instruments. Serving institutions since 1989.
            </p>

            {/* Address */}
            <div className="flex items-start gap-2 mb-3">
              <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                #948, Ori Choudhary Ki Mandi,<br />
                Ambala Cantt – 133001, India
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 mt-4">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    whileHover={{ scale: 1.15, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 ${s.color} transition-colors`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Col 2: Contact */}
          <div>
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {['+91-9813356463', '+91-9813196763', '+91-8295519908'].map(n => (
                    <a key={n} href={`tel:${n.replace(/-/g,'')}`}
                      className="block text-xs text-slate-400 hover:text-blue-400 transition-colors"
                    >{n}</a>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {[
                   
                    'labs@PaulScientificWorks.com',
                  ].map(e => (
                    <a key={e} href={`mailto:${e}`}
                      className="block text-xs text-slate-400 hover:text-blue-400 transition-colors break-all"
                    >{e}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <motion.span
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-2 text-xs text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0" />
                      {l.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Categories */}
          <div>
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Categories</h4>
            <ul className="space-y-2">
              {categoryLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <motion.span
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-2 text-xs text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0" />
                      {l.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Paul Scientific Works. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <span className="text-slate-600">|</span>
            <a
              href="https://kaizenbms.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-blue-400 transition-colors font-medium"
            >
              Made by KaizenBMS.in
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}