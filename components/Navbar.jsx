'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products', hasDropdown: true },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

const productCategories = [
  { label: 'Biology ', id: 'biology' },
  { label: 'Chemistry ', id: 'chemistry' },
  { label: 'Physics ', id: 'physics' },
  { label: 'Geography ', id: 'geography' },
  { label: 'Mathematics ', id: 'mathematics' },
  { label: 'Midwifery & Nursing', id: 'midwifery-nursing' },
  { label: 'Pre-Clinical Sciences', id: 'pre-clinical-sciences' },
  {
  label: 'Laboratory Glassware & Plasticware',
  id: 'laboratory-glassware-plasticware'
},
];

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileProductsOpen(false);
  }, []);

  const handleCategoryClick = (categoryId) => {
    setIsProductsOpen(false);
    setIsOpen(false);
    setMobileProductsOpen(false);
    router.push(`/products?category=${categoryId}`);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsProductsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsProductsOpen(false), 200);
  };

  const handleDownloadCatalogue = () => {
    const link = document.createElement('a');
    link.href = '/catalogue.pdf';
    link.download = 'Paul-Scientific-Works-Catalogue.pdf';
    link.click();
  };

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-md bg-white/90 dark:bg-slate-900/95 border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              className="flex items-center gap-2.5 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white shadow-md border border-slate-200/60 group-hover:shadow-blue-500/20 group-hover:border-blue-200 transition-all duration-300 flex-shrink-0">
                <img
                  src="/image.png"
                  alt="Paul Scientific Works"
                  className="w-full h-full object-contain p-1"
                />
              </div>
             
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    ref={dropdownRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link href="/products">
                      <button className=" cursor-pointer flex items-center gap-1 px-4 py-2 text-slate-700 dark:text-slate-200 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/60">
                        Products
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </Link>

                    <AnimatePresence>
                      {isProductsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl shadow-2xl overflow-hidden z-50"
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="p-2">
                            <div className="px-3 py-2 mb-1 border-b border-slate-100 dark:border-slate-800">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Categories</p>
                            </div>
                            {productCategories.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                className="cursor-pointer w-full text-left"
                              >
                                <motion.div
                                  whileHover={{ x: 3 }}
                                  className="cursor-pointer px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-150"
                                >
                                  {cat.label}
                                </motion.div>
                              </button>
                            ))}
                            <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                              <Link href="/products">
                                <motion.div
                                  whileHover={{ x: 3 }}
                                  className="cursor-pointer px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-150 flex items-center gap-1.5"
                                >
                                  View All Products →
                                </motion.div>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link key={item.href} href={item.href}>
                  <motion.button
                    className="cursor-pointer px-4 py-2 text-slate-700 dark:text-slate-200 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {item.label}
                  </motion.button>
                </Link>
              );
            })}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleDownloadCatalogue}
              className="cursor-pointer hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-slate-700 text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-blue-900/30 transition-all"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden lg:block">Download Catalogue</span>
              <span className="lg:hidden">Catalogue</span>
            </motion.button>

            <motion.button
              className="cursor-pointer md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <div className="px-4 py-4 space-y-1">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => setMobileProductsOpen(o => !o)}
                          className="cursor-pointer w-full flex items-center justify-between px-3 py-2.5 text-slate-700 dark:text-slate-200 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          Products
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {mobileProductsOpen && (
                            <motion.div
                              className="ml-3 mt-1 space-y-0.5 border-l-2 border-blue-200 dark:border-blue-800 pl-3"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.18 }}
                            >
                              {productCategories.map((cat) => (
                                <button
                                  key={cat.id}
                                  onClick={() => handleCategoryClick(cat.id)}
                                  className="cursor-pointer w-full text-left px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                  {cat.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link href={item.href} onClick={() => setIsOpen(false)}>
                        <div className="px-3 py-2.5 text-slate-700 dark:text-slate-200 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          {item.label}
                        </div>
                      </Link>
                    )}
                  </motion.div>
                ))}

                <div className="pt-3 pb-1 border-t border-slate-100 dark:border-slate-800 mt-2">
                  <motion.button
                    onClick={() => { handleDownloadCatalogue(); setIsOpen(false); }}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-slate-700 text-white font-semibold text-sm rounded-xl hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4" />
                    Download Catalogue
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}