"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ChevronLeft, ChevronRight, X } from "lucide-react";

function FullscreenModal({ images, activeIndex, onClose }) {
  const [idx, setIdx] = useState(activeIndex);
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10">
        <X className="w-5 h-5" />
      </button>
      {idx > 0 && (
        <button onClick={(e) => { e.stopPropagation(); setIdx(idx - 1); }} className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10">
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {idx < images.length - 1 && (
        <button onClick={(e) => { e.stopPropagation(); setIdx(idx + 1); }} className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10">
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
      <motion.div
        key={idx}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-3xl max-h-[85vh] w-full aspect-square mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[idx]?.url || images[idx] || "/placeholder-product.jpg"}
          alt={images[idx]?.alt || "Product"}
          fill
          className="object-contain"
          sizes="700px"
        />
      </motion.div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }} className={`w-2 h-2 rounded-full transition-all ${i === idx ? "bg-white w-5" : "bg-white/40"}`} />
        ))}
      </div>
    </motion.div>
  );
}

export default function ProductGallery({ featuredImage, images = [], productName = "" }) {
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [lens, setLens] = useState({ x: 0, y: 0, visible: false });

  const allImages = [
    ...(featuredImage ? [{ url: featuredImage, alt: productName }] : []),
    ...images.map((img) => typeof img === "string" ? { url: img, alt: productName } : img),
  ];

  if (allImages.length === 0) allImages.push({ url: "/placeholder-product.jpg", alt: productName });

  const ZOOM = 2.5;
  const LENS_SIZE = 110;

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setLens({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  const bgX = -(lens.x * ZOOM - LENS_SIZE / 2);
  const bgY = -(lens.y * ZOOM - LENS_SIZE / 2);

  return (
    <>
      <AnimatePresence>
        {fullscreen && (
          <FullscreenModal images={allImages} activeIndex={activeIdx} onClose={() => setFullscreen(false)} />
        )}
      </AnimatePresence>

      <div className="select-none">
        {/* Main Image */}
        <div
          ref={containerRef}
          className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setLens((l) => ({ ...l, visible: false }))}
          onClick={() => setFullscreen(true)}
        >
          <Image
            src={allImages[activeIdx]?.url || "/placeholder-product.jpg"}
            alt={allImages[activeIdx]?.alt || productName}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 500px"
            priority
          />

          {/* Lens */}
          {lens.visible && (
            <div
              className="pointer-events-none absolute rounded-full border-2 border-blue-400 shadow-xl overflow-hidden z-20"
              style={{
                width: LENS_SIZE,
                height: LENS_SIZE,
                left: lens.x - LENS_SIZE / 2,
                top: lens.y - LENS_SIZE / 2,
                backgroundImage: `url(${allImages[activeIdx]?.url || "/placeholder-product.jpg"})`,
                backgroundSize: `${ZOOM * 100}%`,
                backgroundPosition: `${bgX}px ${bgY}px`,
                backgroundRepeat: "no-repeat",
              }}
            />
          )}

          {/* Zoom hint */}
          <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm text-[11px] text-slate-500 border border-slate-200 rounded-lg px-2 py-1 flex items-center gap-1">
            <ZoomIn className="w-3 h-3" /> Click to enlarge
          </div>

          {/* Nav arrows for multiple images */}
          {allImages.length > 1 && (
            <>
              {activeIdx > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveIdx(activeIdx - 1); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white border border-slate-200 rounded-full flex items-center justify-center shadow transition-colors z-10"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-700" />
                </button>
              )}
              {activeIdx < allImages.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveIdx(activeIdx + 1); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white border border-slate-200 rounded-full flex items-center justify-center shadow transition-colors z-10"
                >
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  i === activeIdx ? "border-blue-600 shadow-md" : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <Image
                  src={img.url || "/placeholder-product.jpg"}
                  alt={img.alt || productName}
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}