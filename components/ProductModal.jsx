'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight, MessageCircle, Download } from 'lucide-react';
import { useState } from 'react';

export default function ProductModal({ product, isOpen, onClose, onRelated }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);

  if (!product) return null;

  const images = product.images || [];
  const specs = product.specifications || {};
  const pdfs = product.pdfs || [];

  const whatsappMessage = `Hi, I'm interested in ${product.name} (Code: ${product.productCode}). Could you provide more information?`;
  const whatsappUrl = `https://wa.me/919813356463?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 my-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors z-10"
              >
                <X className="w-6 h-6 text-slate-900 dark:text-white" />
              </button>

              {/* Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Left: Image Gallery */}
                <div className="space-y-4">
                 {/* Main Image */}
<div
  onClick={() => images.length > 0 && setShowZoom(true)}
  className={`relative w-full aspect-square overflow-hidden isolate bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center justify-center group ${
    images.length > 0 ? 'cursor-zoom-in' : ''
  }`}
>
  {/* Actual Product Image */}
  <img
    src={
      images[selectedImageIndex]?.url ||
      product.featuredImage ||
      '/placeholder-product.png'
    }
    alt={product.name}
 className="
  w-full h-full object-cover
  transition-transform duration-500 ease-out
  group-hover:scale-110
"
    onError={(e) => {
      e.currentTarget.src = '/placeholder-product.png';
    }}
  />

  {/* Hover Overlay */}
  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </div>

  {/* Navigation */}
  {images.length > 1 && (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
          );
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
          );
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </>
  )}
</div>
                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`aspect-square rounded-lg border-2 transition-all bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-sm font-bold text-slate-400 ${
                            selectedImageIndex === idx
                              ? 'border-blue-600'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Product Details */}
                <div className="space-y-6 flex flex-col">
                  {/* Header */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                        {product.category?.name}
                      </span>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                      {product.name}
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400">{product.shortDesc}</p>
                  </div>

                  {/* Details Box */}
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold mb-1">
                        Product Code
                      </p>
                      <p className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                        {product.productCode}
                      </p>
                    </div>

                    {product.subCategory && (
                      <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                        <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold mb-1">
                          Subcategory
                        </p>
                        <p className="text-slate-900 dark:text-white">{product.subCategory.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Specifications */}
                  {Object.keys(specs).length > 0 && (
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-3">Specifications</h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {Object.entries(specs).map(([key, value], idx) => (
                          <div key={idx} className="flex justify-between items-start text-sm py-2 border-b border-slate-200 dark:border-slate-700">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{key}:</span>
                            <span className="text-slate-600 dark:text-slate-400 text-right max-w-xs">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Description</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                
{/* Action Buttons */}
<div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
  
  {/* WhatsApp Button */}
  <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
  >
    <MessageCircle className="w-5 h-5" />
    <span>WhatsApp Inquiry</span>
  </a>

  {/* Download Catalogue */}
  {pdfs && pdfs.length > 0 && (
    <a
      href={pdfs[0]}
      download
      className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
    >
      <Download className="w-5 h-5" />
      <span>Download Catalogue</span>
    </a>
  )}
</div>


                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}