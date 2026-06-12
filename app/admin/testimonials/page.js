"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Star, Eye, EyeOff, Loader2, X, Save, Quote } from "lucide-react";

const EMPTY = { quote: "", authorName: "", authorRole: "", organization: "", image: "", rating: 5, featured: false, showOnHome: true, order: 0 };

function Modal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = "w-full px-3 py-2.5 bg-slate-900 border border-slate-600 hover:border-slate-500 focus:border-blue-500 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all";
  const lbl = "block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-4 border-b border-slate-700">
          <h3 className="font-bold text-white flex items-center gap-2"><Quote className="w-4 h-4 text-blue-400" />{initial ? "Edit Testimonial" : "Add Testimonial"}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
          <div><label className={lbl}>Quote *</label>
            <textarea required rows={3} value={form.quote} onChange={e => set("quote", e.target.value)} className={`${inp} resize-none`} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Author Name *</label><input required type="text" value={form.authorName} onChange={e => set("authorName", e.target.value)} className={inp} /></div>
            <div><label className={lbl}>Role</label><input type="text" value={form.authorRole} onChange={e => set("authorRole", e.target.value)} className={inp} /></div>
          </div>
          <div><label className={lbl}>Organization</label><input type="text" value={form.organization} onChange={e => set("organization", e.target.value)} className={inp} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Rating</label>
              <select value={form.rating} onChange={e => set("rating", parseInt(e.target.value))} className={inp}>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select></div>
            <div><label className={lbl}>Order</label><input type="number" value={form.order} onChange={e => set("order", parseInt(e.target.value)||0)} className={inp} /></div>
          </div>
          <div className="flex gap-5">
            {[{key:"featured",label:"Featured"},{key:"showOnHome",label:"Show on Home"}].map(({key,label}) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)} className="w-4 h-4 accent-blue-500" />
                <span className="text-sm text-slate-300">{label}</span>
              </label>
            ))}
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

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    fetch("/api/testimonials?limit=100").then(r => r.json()).then(d => setItems(d.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async (form) => {
    if (modal === "new") {
      await fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch(`/api/testimonials/${modal.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setModal(null); load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    setDeleting(id);
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    setDeleting(null); load();
  };

  const handleToggle = async (id, field, value) => {
    await fetch(`/api/testimonials/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: !value }) });
    load();
  };

  return (
    <>
      <AnimatePresence>{modal && <Modal initial={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}</AnimatePresence>
      <div className="max-w-5xl space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div><h1 className="text-2xl font-extrabold text-white">Testimonials</h1><p className="text-slate-400 text-sm mt-0.5">{items.length} total</p></div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setModal("new")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-md transition-colors">
            <Plus className="w-4 h-4" /> Add Testimonial
          </motion.button>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden">
          {loading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-7 h-7 text-blue-500 animate-spin" /></div>
          : items.length === 0 ? <div className="text-center py-16"><Quote className="w-12 h-12 text-slate-700 mx-auto mb-3" /><p className="text-slate-400 text-sm">No testimonials yet</p></div>
          : <div className="divide-y divide-slate-700/50">
              {items.map(t => (
                <div key={t.id} className="p-4 hover:bg-slate-700/30 transition-colors flex items-start gap-4">
                  <div className="w-9 h-9 bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-800/50">
                    <Quote className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(t.rating||5)].map((_,i) => <Star key={i} className="w-3 h-3 text-yellow-400" style={{fill:"currentColor"}} />)}
                    </div>
                    <p className="text-sm text-slate-300 italic mb-1 line-clamp-1">"{t.quote}"</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-white">{t.authorName}</span>
                      {t.organization && <span className="text-xs text-slate-500 bg-slate-700/60 rounded-full px-2 py-0.5">{t.organization}</span>}
                      {t.showOnHome && <span className="text-[10px] font-bold text-blue-300 bg-blue-900/40 border border-blue-700/50 rounded-full px-2 py-0.5">On Home</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => handleToggle(t.id, "showOnHome", t.showOnHome)} className={`p-1.5 rounded-lg transition-colors ${t.showOnHome ? "text-green-400 bg-green-900/30 hover:bg-green-900/60 border border-green-700/40" : "text-slate-500 hover:bg-slate-700"}`}>
                      {t.showOnHome ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => setModal(t)} className="p-1.5 text-blue-400 bg-blue-900/30 hover:bg-blue-900/60 border border-blue-800/40 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(t.id)} disabled={deleting === t.id} className="p-1.5 text-red-400 bg-red-900/30 hover:bg-red-900/60 border border-red-800/40 rounded-lg transition-colors disabled:opacity-50">
                      {deleting === t.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>}
        </div>
      </div>
    </>
  );
}