"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => setSettings(d.data || {})).finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inp = "w-full px-3 py-2.5 bg-slate-900 border border-slate-600 hover:border-slate-500 focus:border-blue-500 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all";
  const lbl = "block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5";

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;

  return (
    <div className="max-w-2xl space-y-5">
      <div><h1 className="text-2xl font-extrabold text-white">Settings</h1><p className="text-slate-400 text-sm mt-0.5">Website configuration</p></div>
      {saved && <div className="bg-green-900/30 border border-green-700/50 text-green-300 text-sm rounded-xl px-4 py-3">Settings saved successfully!</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { section: "Contact Information", fields: [
            { key: "phone1", label: "Phone 1", placeholder: "+91-9813356463" },
            { key: "phone2", label: "Phone 2", placeholder: "+91-9813196763" },
            { key: "email1", label: "Email 1", placeholder: "info@example.com" },
            { key: "whatsapp", label: "WhatsApp Number", placeholder: "919813356463" },
          ]},
          { section: "Social Media", fields: [
            { key: "youtube", label: "YouTube URL" },
            { key: "instagram", label: "Instagram URL" },
            { key: "facebook", label: "Facebook URL" },
          ]},
          { section: "SEO", fields: [
            { key: "metaTitle", label: "Meta Title" },
            { key: "metaDescription", label: "Meta Description" },
          ]},
        ].map(({ section, fields }) => (
          <div key={section} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">{section}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className={lbl}>{label}</label>
                  <input type="text" value={settings[key] || ""} onChange={e => set(key, e.target.value)} placeholder={placeholder} className={inp} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <motion.button type="submit" disabled={saving} whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? "Saving…" : "Save Settings"}
        </motion.button>
      </form>
    </div>
  );
}