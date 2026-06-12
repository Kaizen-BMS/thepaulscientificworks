"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, MessageCircle, Download, Eye, ChevronDown, ChevronRight } from "lucide-react";

const WHATSAPP_NUMBER = "919999999999";

function ImageZoom({ src, alt, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-2xl w-full mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors text-lg font-bold">×</button>
          <div className="relative aspect-square">
            <Image src={src || "/placeholder-product.jpg"} alt={alt} fill className="object-contain p-6" sizes="600px" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProductRow({ product, index }) {
  const [zoomSrc, setZoomSrc] = useState(null);
  const [hovered, setHovered] = useState(false);

  const waMsg = encodeURIComponent(`Hello, I am interested in: ${product.name} (ID: ${product.productCode}). Please provide more details.`);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;

  return (
    <>
      {zoomSrc && <ImageZoom src={zoomSrc} alt={product.name} onClose={() => setZoomSrc(null)} />}
      <tr
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`border-b border-slate-200 transition-colors duration-150 ${
          hovered ? "bg-blue-50/70" : index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
        }`}
      >
        {/* Image */}
        <td className="p-2 border-r border-slate-200 w-24 align-middle">
          <div
            className="relative w-[72px] h-[72px] mx-auto rounded-lg overflow-hidden border border-slate-200 bg-white cursor-zoom-in group shadow-sm flex-shrink-0"
            onClick={() => setZoomSrc(product.featuredImage)}
          >
            <Image
              src={product.featuredImage || "/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-contain p-1 group-hover:scale-105 transition-transform duration-200"
              sizes="72px"
            />
            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 flex items-center justify-center transition-colors">
              <ZoomIn className="w-4 h-4 text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </td>

        {/* Code + Name */}
        <td className="px-3 py-2.5 border-r border-slate-200 w-56 align-top">
          <div className="space-y-1">
            <span className="inline-block font-mono text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 leading-tight">
              {product.productCode}
            </span>
            <Link href={`/products/${product.slug}`}>
              <p className="text-[13px] font-bold text-slate-800 hover:text-blue-700 transition-colors leading-snug cursor-pointer mt-0.5">
                {product.name}
              </p>
            </Link>
            {product.unit && (
              <p className="text-[11px] text-slate-400">Per {product.unit}</p>
            )}
          </div>
        </td>

        {/* Description + Actions */}
        <td className="px-3 py-2.5 align-top">
          <p className="text-[12.5px] text-slate-600 leading-relaxed line-clamp-2 mb-2">
            {product.shortDesc || product.description || "Scientific educational equipment of premium quality."}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href={`/products/${product.slug}`}>
              <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold transition-colors cursor-pointer">
                <Eye className="w-3 h-3" /> Details
              </span>
            </Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-green-700 hover:text-green-900 font-semibold transition-colors">
              <MessageCircle className="w-3 h-3" /> Enquire
            </a>
            {product.pdfs?.length > 0 && (
              <a href={product.pdfs[0].url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-800 font-semibold transition-colors">
                <Download className="w-3 h-3" /> PDF
              </a>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}

function SubCatTable({ name, products }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-3.5 py-2 text-left transition-colors"
      >
        {open ? <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />}
        <span className="text-[13px] font-semibold text-slate-700">{name}</span>
        <span className="ml-auto text-[11px] text-slate-500 bg-white border border-slate-200 rounded-full px-2 py-0.5">
          {products.length}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="border border-t-0 border-slate-200 rounded-b-lg overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
                    <th className="py-2 px-3 text-[11px] font-semibold text-left border-r border-blue-600 w-24">IMAGE</th>
                    <th className="py-2 px-3 text-[11px] font-semibold text-left border-r border-blue-600 w-56">PRODUCT CODE / NAME</th>
                    <th className="py-2 px-3 text-[11px] font-semibold text-left">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => <ProductRow key={p.id} product={p} index={i} />)}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductTable({ products }) {
  // Group by subcategory
  const subMap = {};
  const noSub = [];

  for (const p of products) {
    const sub = p.subCategory?.name;
    if (sub) {
      if (!subMap[sub]) subMap[sub] = [];
      subMap[sub].push(p);
    } else {
      noSub.push(p);
    }
  }

  const hasSubCats = Object.keys(subMap).length > 0;

  if (!hasSubCats && noSub.length === 0) return null;

  if (!hasSubCats) {
    return (
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
              <th className="py-2 px-3 text-[11px] font-semibold text-left border-r border-blue-600 w-24">IMAGE</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-left border-r border-blue-600 w-56">PRODUCT CODE / NAME</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-left">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {noSub.map((p, i) => <ProductRow key={p.id} product={p} index={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      {Object.entries(subMap).map(([sub, prods]) => (
        <SubCatTable key={sub} name={sub} products={prods} />
      ))}
      {noSub.length > 0 && (
        <div className="mt-3 border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
                <th className="py-2 px-3 text-[11px] font-semibold text-left border-r border-blue-600 w-24">IMAGE</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-left border-r border-blue-600 w-56">PRODUCT CODE / NAME</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-left">DESCRIPTION</th>
              </tr>
            </thead>
            <tbody>
              {noSub.map((p, i) => <ProductRow key={p.id} product={p} index={i} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}