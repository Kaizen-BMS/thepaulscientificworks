"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Loader2, Search, X, BookOpen, Star } from "lucide-react";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    fetch(`/api/blogs?${p}&limit=100`).then(r => r.json()).then(d => setBlogs(d.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [search]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog post?")) return;
    setDeleting(id);
    await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    setDeleting(null); load();
  };

  const toggleFeatured = async (id, val) => {
    await fetch(`/api/blogs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ featured: !val }) });
    load();
  };

  const filtered = search.trim()
    ? blogs.filter(b => b.title?.toLowerCase().includes(search.toLowerCase()) || b.category?.toLowerCase().includes(search.toLowerCase()))
    : blogs;

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-extrabold text-white">Blog Posts</h1><p className="text-slate-400 text-sm mt-0.5">{blogs.length} posts</p></div>
        <Link href="/admin/blogs/new">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-md transition-colors">
            <Plus className="w-4 h-4" /> New Post
          </motion.button>
        </Link>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…"
          className="w-full pl-9 pr-9 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
        />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"><X className="w-3.5 h-3.5" /></button>}
      </div>

      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden">
        {loading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-7 h-7 text-blue-500 animate-spin" /></div>
        : filtered.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No blog posts yet</p>
            <Link href="/admin/blogs/new"><button className="mt-3 text-blue-400 hover:text-blue-300 text-xs underline">Create first post</button></Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-slate-700">
                <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 w-16">IMG</th>
                <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Title</th>
                <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Category</th>
                <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Author</th>
                <th className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-700/50">
                {filtered.map(blog => (
                  <tr key={blog.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative w-10 h-10 bg-slate-900 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0">
                        <Image src={blog.image || "/blogs/placeholder.jpg"} alt={blog.title} fill className="object-cover" sizes="40px"
                          onError={e => { e.currentTarget.style.display="none"; }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-white line-clamp-1">{blog.title}</p>
                      <p className="text-xs text-slate-500 font-mono">{blog.slug}</p>
                      {blog.featured && <span className="inline-flex items-center gap-0.5 text-[10px] text-yellow-400 font-medium"><Star className="w-2.5 h-2.5" style={{fill:"currentColor"}} />Featured</span>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs text-slate-400">{blog.category}</span></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><span className="text-xs text-slate-400">{blog.author}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => toggleFeatured(blog.id, blog.featured)}
                          className={`p-1.5 rounded-lg transition-colors border ${blog.featured ? "text-yellow-400 bg-yellow-900/30 border-yellow-700/40" : "text-slate-500 bg-slate-700/40 border-slate-600/40 hover:border-yellow-700/40 hover:text-yellow-400"}`}>
                          <Star className="w-3.5 h-3.5" style={{fill: blog.featured ? "currentColor" : "none"}} />
                        </button>
                        <Link href={`/admin/blogs/${blog.id}/edit`}>
                          <button className="p-1.5 text-blue-400 bg-blue-900/30 hover:bg-blue-900/60 border border-blue-800/40 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        </Link>
                        <button onClick={() => handleDelete(blog.id)} disabled={deleting === blog.id}
                          className="p-1.5 text-red-400 bg-red-900/30 hover:bg-red-900/60 border border-red-800/40 rounded-lg transition-colors disabled:opacity-50">
                          {deleting === blog.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}