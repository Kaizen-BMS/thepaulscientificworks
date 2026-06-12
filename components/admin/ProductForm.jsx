"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2, Upload, X, Plus, Trash2 } from "lucide-react";

export default function ProductForm({ mode = "create", initialData = null }) {
  const router = useRouter();
  const fileRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: initialData?.id || "",
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "",
    categorySlug: initialData?.categorySlug || "",
    shortDescription: initialData?.shortDescription || "",
    fullDescription: initialData?.fullDescription || "",
    features: initialData?.features || [],
    featured: initialData?.featured || false,
    image: initialData?.image || "",
  });

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(d.data || []));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const cat = categories.find(c => c.id === catId);
    if (cat) {
      set("category", cat.name);
      set("categorySlug", cat.slug || cat.id);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!form.id) { setError("Enter Product ID before uploading image."); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    fd.append("productId", form.id);
    try {
      const res = await fetch("/api/products/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.imagePath) {
        set("image", data.imagePath);
        setImagePreview(data.imagePath);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch { setError("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url = mode === "edit" ? `/api/products/${form.id}` : "/api/products";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug: form.slug || form.id.toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save"); return; }
      router.push("/admin/products");
    } catch { setError("Failed to save product"); }
    finally { setSaving(false); }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      set("features", [...form.features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const inp = "w-full px-3 py-2.5 bg-slate-900 border border-slate-600 hover:border-slate-500 focus:border-blue-500 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all";
  const lbl = "block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/products">
          <button className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-white">{mode === "edit" ? "Edit Product" : "Add New Product"}</h1>
          {initialData && <p className="text-slate-400 text-xs font-mono mt-0.5">{initialData.id}</p>}
        </div>
      </div>

      {error && <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm rounded-xl px-4 py-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Product ID *</label>
              <input required type="text" value={form.id} onChange={e => set("id", e.target.value.toUpperCase())}
                placeholder="BIO-001" className={inp} disabled={mode === "edit"}
              />
            </div>
            <div>
              <label className={lbl}>Category *</label>
              <select required value={form.categorySlug || ""} onChange={handleCategoryChange} className={inp + " appearance-none cursor-pointer"}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={lbl}>Product Name *</label>
              <input required type="text" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Skeleton Human Model" className={inp} />
            </div>
            <div className="col-span-2">
              <label className={lbl}>URL Slug</label>
              <input type="text" value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="skeleton-human-model" className={inp} />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Product Image</h2>
          <div className="flex gap-5 items-start flex-wrap">
            <div className="relative w-32 h-32 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex-shrink-0">
              {imagePreview ? (
                <Image src={imagePreview} alt="Product" fill className="object-contain p-2" sizes="128px"
                  onError={e => { e.currentTarget.src = "/products/placeholder.png"; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No image</div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden"
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 text-sm font-medium rounded-xl transition-colors disabled:opacity-60">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? "Uploading…" : "Upload Image"}
              </button>
              <p className="text-slate-500 text-xs">PNG, JPG, WEBP — max 5MB. Saved as {form.id || "PRODUCT-ID"}.*</p>
              <div>
                <label className={lbl}>Or enter image URL</label>
                <input type="text" value={form.image} onChange={e => { set("image", e.target.value); setImagePreview(e.target.value); }}
                  placeholder="/products/BIO-001.png" className={inp}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Descriptions</h2>
          <div className="space-y-4">
            <div>
              <label className={lbl}>Short Description</label>
              <input type="text" value={form.shortDescription} onChange={e => set("shortDescription", e.target.value)}
                placeholder="Brief one-line description shown in catalogue" className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Full Description</label>
              <textarea rows={4} value={form.fullDescription} onChange={e => set("fullDescription", e.target.value)}
                placeholder="Detailed product description…" className={inp + " resize-none"}
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Features</h2>
          <div className="space-y-2 mb-3">
            {form.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-900/60 border border-slate-700/40 rounded-xl px-3 py-2">
                <span className="flex-1 text-sm text-slate-300">{f}</span>
                <button type="button" onClick={() => set("features", form.features.filter((_, j) => j !== i))} className="text-slate-500 hover:text-red-400 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())}
              placeholder="Add a feature and press Enter" className={inp + " flex-1"}
            />
            <button type="button" onClick={addFeature} className="px-3 py-2.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 rounded-xl transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Options</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="w-4 h-4 accent-blue-500" />
            <span className="text-sm font-medium text-slate-300">Featured product (shown on homepage)</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <motion.button type="submit" disabled={saving} whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: saving ? 1 : 0.98 }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-colors text-sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : mode === "edit" ? "Update Product" : "Create Product"}
          </motion.button>
          <Link href="/admin/products">
            <button type="button" className="px-5 py-3 text-slate-400 border border-slate-700 hover:bg-slate-700/60 rounded-xl text-sm font-medium transition-colors">Cancel</button>
          </Link>
        </div>
      </form>
    </div>
  );
}