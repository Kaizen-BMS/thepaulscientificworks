"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2, Upload, X, Plus } from "lucide-react";

export default function BlogForm({ mode = "create", initialData = null }) {
  const router = useRouter();
  const fileRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(initialData?.image || "");

  const autoSlug = (t) => t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    category: initialData?.category || "General",
    author: initialData?.author || "Admin",
    featured: initialData?.featured || false,
    showOnHome: initialData?.showOnHome || false,
    image: initialData?.image || "",
    tags: initialData?.tags || [],
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = async (file) => {
    if (!file) return;
    const id = initialData?.id || `blog-${Date.now()}`;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    fd.append("blogId", id);
    try {
      const res = await fetch("/api/blogs/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.imagePath) { set("image", data.imagePath); setPreview(data.imagePath); }
      else setError(data.error || "Upload failed");
    } catch { setError("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url = mode === "edit" ? `/api/blogs/${initialData.id}` : "/api/blogs";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save"); return; }
      router.push("/admin/blogs");
    } catch { setError("An error occurred"); }
    finally { setSaving(false); }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      set("tags", [...form.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const inp = "w-full px-3 py-2.5 bg-slate-900 border border-slate-600 hover:border-slate-500 focus:border-blue-500 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all";
  const lbl = "block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/blogs">
          <button className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"><ArrowLeft className="w-4 h-4" /></button>
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-white">{mode === "edit" ? "Edit Blog Post" : "New Blog Post"}</h1>
        </div>
      </div>

      {error && <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm rounded-xl px-4 py-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Post Details</h2>
          <div className="space-y-4">
            <div><label className={lbl}>Title *</label>
              <input required type="text" value={form.title} onChange={e => { set("title", e.target.value); if (!form.slug || form.slug === autoSlug(form.title)) set("slug", autoSlug(e.target.value)); }} className={inp} placeholder="Post title" /></div>
            <div><label className={lbl}>Slug *</label>
              <input required type="text" value={form.slug} onChange={e => set("slug", e.target.value)} className={inp} placeholder="post-url-slug" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Category</label><input type="text" value={form.category} onChange={e => set("category", e.target.value)} className={inp} placeholder="Education" /></div>
              <div><label className={lbl}>Author</label><input type="text" value={form.author} onChange={e => set("author", e.target.value)} className={inp} /></div>
            </div>
            <div><label className={lbl}>Excerpt</label>
              <textarea rows={2} value={form.excerpt} onChange={e => set("excerpt", e.target.value)} className={`${inp} resize-none`} placeholder="Brief summary shown in listings" /></div>
            <div><label className={lbl}>Full Content</label>
              <textarea rows={10} value={form.content} onChange={e => set("content", e.target.value)} className={`${inp} resize-none`} placeholder="Full blog content… Use blank lines to separate paragraphs." /></div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Featured Image</h2>
          <div className="flex gap-4 flex-wrap items-start">
            <div className="relative w-28 h-28 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex-shrink-0">
              {preview ? (
                <Image src={preview} alt="Preview" fill className="object-cover" sizes="112px" onError={e => { e.currentTarget.style.display="none"; }} />
              ) : <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No image</div>}
            </div>
            <div className="flex-1 space-y-3">
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden"
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 text-sm font-medium rounded-xl transition-colors disabled:opacity-60">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? "Uploading…" : "Upload Image"}
              </button>
              <div><label className={lbl}>Or image URL</label>
                <input type="text" value={form.image} onChange={e => { set("image", e.target.value); setPreview(e.target.value); }} placeholder="/blogs/my-post.jpg" className={inp} /></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {form.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-700 border border-slate-600 rounded-full px-2.5 py-1">
                #{tag}
                <button type="button" onClick={() => set("tags", form.tags.filter(t => t !== tag))} className="text-slate-500 hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Add tag and press Enter" className={`${inp} flex-1`} />
            <button type="button" onClick={addTag} className="px-3 py-2.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 rounded-xl transition-colors"><Plus className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Visibility & SEO</h2>
          <div className="flex gap-5 mb-5">
            {[{key:"featured",label:"Featured Post"},{key:"showOnHome",label:"Show on Homepage"}].map(({key,label}) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)} className="w-4 h-4 accent-blue-500" />
                <span className="text-sm text-slate-300">{label}</span>
              </label>
            ))}
          </div>
          <div className="space-y-4">
            <div><label className={lbl}>Meta Title</label><input type="text" value={form.metaTitle} onChange={e => set("metaTitle", e.target.value)} className={inp} /></div>
            <div><label className={lbl}>Meta Description</label><textarea rows={2} value={form.metaDescription} onChange={e => set("metaDescription", e.target.value)} className={`${inp} resize-none`} /></div>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button type="submit" disabled={saving} whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : mode === "edit" ? "Update Post" : "Publish Post"}
          </motion.button>
          <Link href="/admin/blogs"><button type="button" className="px-5 py-3 text-slate-400 border border-slate-700 hover:bg-slate-700/60 rounded-xl text-sm font-medium transition-colors">Cancel</button></Link>
        </div>
      </form>
    </div>
  );
}