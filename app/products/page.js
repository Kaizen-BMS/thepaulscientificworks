"use client";
import { useState, useEffect, useRef, useCallback, useMemo, memo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, MessageCircle, ChevronDown, ArrowUp,
  Phone, Mail, Filter, FlaskConical, ChevronRight,
  ZoomIn, Maximize2, Loader2,
} from "lucide-react";

const WHATSAPP  = "919813356463";
const PAGE_SIZE = 10;

/* ─── FULLSCREEN VIEWER ─────────────────────────────────────────────── */
function FullscreenViewer({ src, alt, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/96 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-[90vw] h-[85vh] max-w-4xl"
        initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <Image src={src} alt={alt} fill className="object-contain" sizes="90vw" quality={85} priority
          onError={e => { e.currentTarget.src = "/products/placeholder.png"; }}
        />
      </motion.div>
      <button onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full flex items-center justify-center transition-all">
        <X className="w-5 h-5" />
      </button>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs">ESC or click outside to close</p>
    </motion.div>
  );
}

/* ─── PRODUCT MODAL ─────────────────────────────────────────────────── */
function ProductModal({ product, onClose }) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape" && !fullscreen) onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose, fullscreen]);

  const src    = product.image || "/products/placeholder.png";
  const waMsg  = encodeURIComponent(`Hello, I am interested in: ${product.name} (ID: ${product.id}). Please share pricing and availability.`);

  return (
    <>
      <AnimatePresence>
        {fullscreen && <FullscreenViewer src={src} alt={product.name} onClose={() => setFullscreen(false)} />}
      </AnimatePresence>

      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 md:p-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.92, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-3.5 flex-shrink-0 border-b border-slate-700">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-mono text-[11px] font-bold text-blue-300 bg-blue-900/60 border border-blue-700/80 rounded-md px-2.5 py-1 flex-shrink-0 tracking-wider">
                {product.id}
              </span>
              <h2 className="text-white font-bold text-sm md:text-[15px] leading-tight line-clamp-1">{product.name}</h2>
            </div>
            <button onClick={onClose} className="ml-3 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid md:grid-cols-5">

              {/* Left: Image */}
              <div className="md:col-span-2 p-5 flex flex-col gap-4 border-r border-slate-100 dark:border-slate-700/60">
                <div
                  className="relative w-full aspect-square bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-zoom-in group flex-shrink-0"
                  onClick={() => setFullscreen(true)}
                >
                  <Image src={src} alt={product.name} fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 90vw, 380px" quality={75}
                    onError={e => { e.currentTarget.src = "/products/placeholder.png"; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-white" />
                      <span className="text-white text-[10px] font-medium">Click to enlarge</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 mt-auto flex-shrink-0">
                  <a href={`https://wa.me/${WHATSAPP}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl text-sm transition-all">
                    <MessageCircle className="w-4 h-4" /> WhatsApp Enquiry
                  </a>
                  <div className="grid grid-cols-2 gap-2">
                    <a href="tel:+919813356463" className="flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium py-2 rounded-xl text-xs transition-colors">
                      <Phone className="w-3.5 h-3.5" /> Call Us
                    </a>
                    <a href="mailto:labs@PaulScientificWorks.com" className="flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium py-2 rounded-xl text-xs transition-colors">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: Details */}
              <div className="md:col-span-3 p-5 overflow-y-auto space-y-4">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-full px-3 py-1">
                  <FlaskConical className="w-3 h-3" /> {product.category}
                </span>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{product.name}</h3>

                {product.shortDescription && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-l-[3px] border-blue-400 dark:border-blue-600 pl-3 bg-blue-50/50 dark:bg-blue-900/10 py-2 rounded-r-lg">
                    {product.shortDescription}
                  </p>
                )}

               {Array.isArray(product.fullDescription) ? (
  <ul className="grid gap-3 sm:grid-cols-2">
    {product.fullDescription.map((item, index) => (
      <li
        key={index}
        className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3"
      >
        <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0"></div>
        <span className="text-sm text-slate-300">{item}</span>
      </li>
    ))}
  </ul>
) : (
  <p className="text-slate-300 leading-relaxed">
    {product.fullDescription}
  </p>
)}

                {product.features?.length > 0 && (
                  <div>
                    <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-3">Features</p>
                    <ul className="space-y-2">
                      {product.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ─── PRODUCT ROW ── memoized ───────────────────────────────────────── */
const ProductRow = memo(function ProductRow({ product, index, onOpen }) {
  return (
    <tr onClick={() => onOpen(product)}
      className={`border-b border-slate-700/50 cursor-pointer group transition-colors duration-100 ${
        index % 2 === 0 ? "bg-slate-900" : "bg-slate-800/50"
      } hover:bg-blue-900/30`}>
      <td className="p-2 w-[80px] border-r border-slate-700/50 align-middle">
        <div className="relative w-[62px] h-[62px] mx-auto rounded-lg overflow-hidden bg-white/5 border border-slate-600/50 group-hover:border-blue-500/60 transition-colors shadow-sm">
          <Image src={product.image || "/products/placeholder.png"} alt={product.name} fill
            className="object-contain p-1" sizes="62px" loading="lazy" quality={60}
            onError={e => { e.currentTarget.src = "/products/placeholder.png"; }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <ZoomIn className="w-4 h-4 text-white drop-shadow" />
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5 border-r border-slate-700/50 w-[190px] align-top">
        <span className="inline-block font-mono text-[10px] font-bold text-blue-300 bg-blue-900/50 border border-blue-700/60 rounded-md px-1.5 py-0.5 mb-1.5 leading-tight tracking-wide">
          {product.id}
        </span>
        <p className="text-[12.5px] font-bold text-slate-200 group-hover:text-blue-300 transition-colors leading-snug">{product.name}</p>
      </td>
      <td className="px-3 py-2.5 align-top">
        <p className="text-[12px] text-slate-400 leading-relaxed line-clamp-2">{product.shortDescription}</p>
        <span className="inline-flex items-center gap-1 text-[10.5px] text-blue-400 font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          View details <ChevronRight className="w-3 h-3" />
        </span>
      </td>
    </tr>
  );
});

/* ─── CATEGORY BLOCK — single-open + paginated ──────────────────────── */
const CategoryBlock = memo(function CategoryBlock({ categoryName, products, isOpen, onToggle, onOpen }) {
  const [page, setPage] = useState(1);
  const total      = products.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const visible    = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { if (!isOpen) setPage(1); }, [isOpen]);

  return (
    <div className="mb-3 rounded-xl overflow-hidden border border-slate-700/60 shadow-sm">
      <button onClick={onToggle}
        className="w-full flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-5 py-3.5 text-left hover:from-slate-700 hover:to-slate-800 transition-colors duration-150">
        <motion.span animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.18 }}>
          <ChevronDown className="w-4 h-4 text-blue-400 flex-shrink-0" />
        </motion.span>
        <span className="font-bold text-[13.5px] tracking-wide text-slate-100 flex-1 text-left">{categoryName}</span>
        <span className="text-[11px] bg-blue-900/50 border border-blue-700/50 text-blue-300 rounded-full px-2.5 py-0.5 font-medium flex-shrink-0">
          {total} {total === 1 ? "product" : "products"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-700/90 text-white">
                  <th className="py-2 px-3 text-[10px] font-semibold text-left border-r border-blue-600/60 w-[80px] uppercase tracking-wider">Photo</th>
                  <th className="py-2 px-3 text-[10px] font-semibold text-left border-r border-blue-600/60 w-[190px] uppercase tracking-wider">Product ID / Name</th>
                  <th className="py-2 px-3 text-[10px] font-semibold text-left uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p, i) => <ProductRow key={p.id} product={p} index={i} onOpen={onOpen} />)}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="px-4 py-2.5 bg-slate-900/70 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
                </span>
                <div className="flex items-center gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1.5 text-[11px] text-slate-400 border border-slate-700 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 rotate-180" /> Prev
                  </button>
                  <span className="text-[11px] text-slate-500 px-1">{page}/{totalPages}</span>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1.5 text-[11px] text-slate-400 border border-slate-700 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1">
                    Next <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

/* ─── PRODUCTS CONTENT (inside Suspense) ────────────────────────────── */
function ProductsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [products,     setProducts]     = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [selCat,       setSelCat]       = useState(searchParams.get("category") || "");
  const [modal,        setModal]        = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const searchRef    = useRef(null);
  const debRef       = useRef(null);
  const didAutoOpen  = useRef(false);

  // Sync URL param → filter
  useEffect(() => {
    const cat = searchParams.get("category") || "";
    setSelCat(cat);
    didAutoOpen.current = false; // reset so auto-open fires again
  }, [searchParams]);

  // Load categories
  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(d => setCategories(d.data || []))
      .catch(() => {});
  }, []);

  // Load products (debounced on search)
useEffect(() => {
  clearTimeout(debRef.current);

  const delay = search ? 350 : 0;

  debRef.current = setTimeout(async () => {
    setLoading(true);

    try {
      // Fetch ALL products first
      const res = await fetch(`/api/products?limit=500`);

      const data = await res.json();

      let allProducts = data.data || [];

      // Search filter
      if (search.trim()) {
        const s = search.toLowerCase();

        allProducts = allProducts.filter(
          p =>
            p.name?.toLowerCase().includes(s) ||
            p.id?.toLowerCase().includes(s) ||
            p.shortDescription?.toLowerCase().includes(s)
        );
      }

      // Category filter
      if (selCat) {
       const normalizedSelCat = selCat
  .toLowerCase()
  .replace(/&/g, "and")
  .replace(/\s+/g, "-");

const categoryObj = categories.find((c) => {
  const normalizedId = c.id
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");

  const normalizedSlug = c.slug
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");

  return (
    normalizedId === normalizedSelCat ||
    normalizedSlug === normalizedSelCat
  );
});
        if (categoryObj) {
        allProducts = allProducts.filter((p) => {

  const productCategory = p.category
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");

  const targetCategory = categoryObj.name
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");

  return productCategory === targetCategory;
});
        }
      }

      setProducts(allProducts);

      didAutoOpen.current = false;

    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }

  }, delay);

  return () => clearTimeout(debRef.current);

}, [search, selCat, categories]);

  // Scroll to top
  useEffect(() => {
    const h = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Grouped data
  const grouped = useMemo(() => {
    const m = {};
    for (const p of products) {
      const cat = p.category || "General";
      if (!m[cat]) m[cat] = [];
      m[cat].push(p);
    }
    return m;
  }, [products]);

  const categoryNames = useMemo(() => Object.keys(grouped), [grouped]);

  // Auto-open the matching category when URL param is present
  useEffect(() => {
    if (loading || didAutoOpen.current || categoryNames.length === 0) return;

    if (selCat) {
      // Find which category name matches the slug
      const catObj = categories.find(c =>
        c.id === selCat || c.slug === selCat || c.id.toLowerCase() === selCat.toLowerCase()
      );
      const targetName = catObj
        ? categoryNames.find(n => n === catObj.name)
        : categoryNames.find(n => n.toLowerCase().replace(/\s+/g, "-") === selCat.toLowerCase());

      const nameToOpen = targetName || categoryNames[0];
      setOpenCategory(nameToOpen);
      didAutoOpen.current = true;

      // Scroll to that section
      if (targetName) {
        setTimeout(() => {
          const el = document.getElementById(`cat-${selCat}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 350);
      }
    } else {
      // No filter — open first category
      if (!openCategory) {
        setOpenCategory(categoryNames[0]);
        didAutoOpen.current = true;
      }
    }
  }, [loading, categoryNames, categories, selCat]);

  const handleToggle = useCallback((name) => {
    setOpenCategory(prev => prev === name ? null : name);
  }, []);

const handleCatFilter = useCallback((val) => {
  setSelCat(val);
  setOpenCategory(null);
  didAutoOpen.current = false;

  const params = new URLSearchParams();

  if (val) params.set("category", val);
  if (search) params.set("search", search);

  router.replace(`/products?${params.toString()}`, { scroll: false });
}, [search, router]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelCat("");
    setOpenCategory(null);
    didAutoOpen.current = false;
    router.replace("/products", { scroll: false });
    searchRef.current?.focus();
  }, [router]);

  const hasFilters = Boolean(search || selCat);

  return (
    <>
      <AnimatePresence>
        {modal && <ProductModal key="modal" product={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-950 text-white pt-24 md:pt-28">
        {/* Header + Filters */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-4 pt-8 pb-6">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4">
              <a href="/" className="hover:text-slate-300 transition-colors">Home</a>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-300">Products</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Scientific Products Catalogue
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mb-6">
              Premium laboratory & educational equipment for institutions across India.
              Click any product to view full details and enquire.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                <input ref={searchRef} type="text" value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products or ID…"
                  className="w-full pl-9 pr-9 py-2.5 text-sm bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                <select value={selCat} onChange={e => handleCatFilter(e.target.value)}
                  className="pl-9 pr-9 py-2.5 text-sm bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 appearance-none transition-all cursor-pointer min-w-[180px]">
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>

              {hasFilters && (
                <button onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs text-red-400 border border-red-900/60 bg-red-900/20 hover:bg-red-900/40 rounded-lg px-3 py-2.5 font-semibold transition-colors">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}

              <div className="ml-auto text-sm font-medium hidden sm:flex items-center gap-2 text-slate-400">
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  : <><span className="text-blue-400 font-bold">{products.length}</span><span>products</span></>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Listing */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-9 h-9 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-500 text-sm">Loading catalogue…</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <Search className="w-7 h-7 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-400 mb-2">No products found</h3>
              <p className="text-slate-600 text-sm mb-5">Try different search terms or clear your filters.</p>
              <button onClick={clearFilters} className="text-blue-400 hover:text-blue-300 underline text-sm font-semibold transition-colors">
                Clear all filters
              </button>
            </div>
          ) : (
            <div>
              {categoryNames.map(cat => {
                const catObj  = categories.find(c => c.name === cat);
                const catSlug = catObj?.id || cat.toLowerCase().replace(/\s+/g, "-");
                return (
                  <div key={cat} id={`cat-${catSlug}`}>
                    <CategoryBlock
                      categoryName={cat}
                      products={grouped[cat]}
                      isOpen={openCategory === cat}
                      onToggle={() => handleToggle(cat)}
                      onOpen={setModal}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-500 text-white w-10 h-10 rounded-full shadow-lg shadow-blue-900/50 flex items-center justify-center transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-28">
        <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
