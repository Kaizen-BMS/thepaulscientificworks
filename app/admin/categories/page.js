"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Loader2, X, Save, Tags } from "lucide-react";

const EMPTY = { id: "", name: "", slug: "", description: "", icon: "📦", color: "blue", order: 0 };

function CategoryModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = "w-full px-3 py-2.5 bg-slate-900 border border-slate-600 hover:border-slate-500 focus:border-blue-500 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all";
  const lbl = "block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl"
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-4 rounded-t-2xl border-b border-slate-700">
          <h3 className="font-bold text-white flex items-center gap-2"><Tags className="w-4 h-4 text-blue-400" />{initial ? "Edit Category" : "Add Category"}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>ID (slug) *</label><input required type="text" value={form.id} onChange={e => set("id", e.target.value.toLowerCase().replace(/\s+/g,"-"))} placeholder="biology" className={inp} disabled={!!initial} /></div>
            <div><label className={lbl}>Name *</label><input required type="text" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Biology" className={inp} /></div>
          </div>
          <div><label className={lbl}>Description</label><textarea rows={2} value={form.description} onChange={e => set("description", e.target.value)} className={inp + " resize-none"} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Icon (emoji)</label><input type="text" value={form.icon} onChange={e => set("icon", e.target.value)} className={inp} /></div>
            <div><label className={lbl}>Order</label><input type="number" value={form.order} onChange={e => set("order", parseInt(e.target.value)||0)} className={inp} /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={async () => { setSaving(true); await onSave(form); setSaving(false); }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? "Saving…" : "Save"}
            </button>
            <button onClick={onClose} className="px-4 py-2.5 text-slate-400 border border-slate-700 hover:bg-slate-700/60 rounded-xl text-sm transition-colors">Cancel</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(d.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async (form) => {
    if (modal === "new") {
      await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch(`/api/categories/${form.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm(`Delete category "${id}"?`)) return;
    setDeleting(id);
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  return (
    <>
      <AnimatePresence>
        {modal && <CategoryModal initial={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
      </AnimatePresence>
      <div className="max-w-4xl space-y-5">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-extrabold text-white">Categories</h1><p className="text-slate-400 text-sm mt-0.5">{categories.length} categories</p></div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setModal("new")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-md transition-colors">
            <Plus className="w-4 h-4" /> Add Category
          </motion.button>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-7 h-7 text-blue-500 animate-spin" /></div>
          ) : (
            <table className="w-full">
              <thead><tr className="border-b border-slate-700">
                <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Category</th>
                <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">ID / Slug</th>
                <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Order</th>
                <th className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-700/50">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{cat.icon}</span>
                        <p className="text-sm font-semibold text-white">{cat.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="font-mono text-xs text-slate-400">{cat.id}</span></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><span className="text-xs text-slate-400">{cat.order}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setModal(cat)} className="p-1.5 text-blue-400 bg-blue-900/30 hover:bg-blue-900/60 border border-blue-800/40 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(cat.id)} disabled={deleting === cat.id} className="p-1.5 text-red-400 bg-red-900/30 hover:bg-red-900/60 border border-red-800/40 rounded-lg transition-colors disabled:opacity-50">
                          {deleting === cat.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}