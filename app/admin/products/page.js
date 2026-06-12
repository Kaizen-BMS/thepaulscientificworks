"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Search, Edit2, Trash2, Loader2, Package, X, Star } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [cat, setCat] = useState("");
  const [categories, setCategories] = useState([]);

  const load = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (cat) p.set("category", cat);
    Promise.all([
      fetch(`/api/products?${p}`).then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
    ]).then(([prod, cats]) => {
      setProducts(prod.data || []);
      setCategories(cats.data || []);
    }).finally(() => setLoading(false));
  }, [search, cat]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm(`Delete product ${id}?`)) return;
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  return (
    <div className="max-w-6xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Products</h1>
          <p className="text-slate-400 text-sm mt-0.5">{products.length} products</p>
        </div>
        <Link href="/admin/products/new">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-md transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </motion.button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
            className="w-full pl-9 pr-9 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <select value={cat} onChange={e => setCat(e.target.value)}
          className="px-3 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 text-slate-300 rounded-xl text-sm focus:outline-none appearance-none cursor-pointer transition-all min-w-[140px]"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 font-medium text-sm">No products found</p>
            <Link href="/admin/products/new"><button className="mt-3 text-blue-400 hover:text-blue-300 text-xs underline">Add first product</button></Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 w-16">IMG</th>
                  <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Product</th>
                  <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Category</th>
                  <th className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {products.map((product) => (
                  <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative w-10 h-10 bg-slate-900 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0">
                        <Image src={product.image || "/products/placeholder.png"} alt={product.name} fill className="object-contain p-0.5" sizes="40px"
                          onError={e => { e.currentTarget.src = "/products/placeholder.png"; }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block font-mono text-[10px] font-bold text-blue-400 bg-blue-900/40 border border-blue-800/50 rounded px-1.5 py-0.5 mb-1">{product.id}</span>
                      <p className="text-sm font-semibold text-white line-clamp-1">{product.name}</p>
                      {product.featured && <span className="inline-flex items-center gap-0.5 text-[10px] text-yellow-400 font-medium"><Star className="w-2.5 h-2.5" style={{fill:"currentColor"}} />Featured</span>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-slate-400">{product.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <button className="p-1.5 text-blue-400 bg-blue-900/30 hover:bg-blue-900/60 border border-blue-800/40 rounded-lg transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button onClick={() => handleDelete(product.id)} disabled={deleting === product.id}
                          className="p-1.5 text-red-400 bg-red-900/30 hover:bg-red-900/60 border border-red-800/40 rounded-lg transition-colors disabled:opacity-50">
                          {deleting === product.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}