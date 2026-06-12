"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Loader2, X, Save, Users, Shield } from "lucide-react";

function AddAdminModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = "w-full px-3 py-2.5 bg-slate-900 border border-slate-600 hover:border-slate-500 focus:border-indigo-500 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all";
  const lbl = "block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl"
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-4 rounded-t-2xl border-b border-slate-700">
          <h3 className="font-bold text-white flex items-center gap-2"><Users className="w-4 h-4 text-indigo-400" />Add Admin</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div><label className={lbl}>Full Name *</label><input required type="text" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Admin Name" className={inp} /></div>
          <div><label className={lbl}>Email *</label><input required type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="admin@example.com" className={inp} /></div>
          <div><label className={lbl}>Password *</label><input required type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" className={inp} /></div>
          <div><label className={lbl}>Role</label>
            <select value={form.role} onChange={e => set("role", e.target.value)} className={inp + " appearance-none cursor-pointer"}>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={async () => { setSaving(true); await onSave(form); setSaving(false); }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? "Creating…" : "Create Admin"}
            </button>
            <button onClick={onClose} className="px-4 py-2.5 text-slate-400 border border-slate-700 hover:bg-slate-700/60 rounded-xl text-sm transition-colors">Cancel</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admins").then(r => r.json()).then(d => setAdmins(d.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async (form) => {
    const res = await fetch("/api/admins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setModal(false); load(); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this admin?")) return;
    setDeleting(id);
    await fetch(`/api/admins/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  return (
    <>
      <AnimatePresence>{modal && <AddAdminModal onClose={() => setModal(false)} onSave={handleSave} />}</AnimatePresence>
      <div className="max-w-4xl space-y-5">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-extrabold text-white">Manage Admins</h1><p className="text-slate-400 text-sm mt-0.5">{admins.length} admins</p></div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-md transition-colors">
            <Plus className="w-4 h-4" /> Add Admin
          </motion.button>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-7 h-7 text-indigo-500 animate-spin" /></div>
          ) : (
            <table className="w-full">
              <thead><tr className="border-b border-slate-700">
                <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Admin</th>
                <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Email</th>
                <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Role</th>
                <th className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-700/50">
                {admins.map(admin => (
                  <tr key={admin.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-indigo-900/60 rounded-full flex items-center justify-center border border-indigo-800/50">
                          <span className="text-indigo-300 text-xs font-bold">{admin.name?.[0]}</span>
                        </div>
                        <span className="text-sm font-semibold text-white">{admin.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs text-slate-400">{admin.email}</span></td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${admin.role === "superadmin" ? "bg-indigo-900/50 text-indigo-300 border border-indigo-700/50" : "bg-blue-900/50 text-blue-300 border border-blue-700/50"}`}>
                        {admin.role === "superadmin" && <Shield className="w-2.5 h-2.5" />}{admin.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button onClick={() => handleDelete(admin.id)} disabled={deleting === admin.id || admin.role === "superadmin"}
                          className="p-1.5 text-red-400 bg-red-900/30 hover:bg-red-900/60 border border-red-800/40 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                          {deleting === admin.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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