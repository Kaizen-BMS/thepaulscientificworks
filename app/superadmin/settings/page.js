"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";

export default function SuperAdminSettingsPage() {
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

  const inp = "w-full px-3 py-2.5 bg-slate-900 border border-slate-600 hover:border-slate-500 focus:border-indigo-500 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all";
  const lbl = "block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5";
  const tex = inp + " resize-none";

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>;

  const SECTIONS = [
    { title: "Site Identity", fields: [
      { key: "siteName", label: "Site Name" },
      { key: "siteTagline", label: "Tagline" },
    ]},
    { title: "Contact Information", fields: [
      { key: "phone1", label: "Phone 1" },
      { key: "phone2", label: "Phone 2" },
      { key: "phone3", label: "Phone 3" },
      { key: "email1", label: "Email 1" },
      { key: "email2", label: "Email 2" },
      { key: "whatsapp", label: "WhatsApp Number" },
      { key: "address", label: "Address", textarea: true, full: true },
    ]},
    { title: "Social Media", fields: [
      { key: "youtube", label: "YouTube URL" },
      { key: "instagram", label: "Instagram URL" },
      { key: "facebook", label: "Facebook URL" },
    ]},
    { title: "SEO", fields: [
      { key: "metaTitle", label: "Meta Title", full: true },
      { key: "metaDescription", label: "Meta Description", textarea: true, full: true },
    ]},
    { title: "Homepage", fields: [
      { key: "homeHeroTitle", label: "Hero Title", full: true },
      { key: "homeHeroSubtitle", label: "Hero Subtitle", full: true },
    ]},
  ];

  return (
    <div className="max-w-3xl space-y-5">
      <div><h1 className="text-2xl font-extrabold text-white">Website Settings</h1><p className="text-slate-400 text-sm mt-0.5">Full system configuration</p></div>
      {saved && <div className="bg-green-900/30 border border-green-700/50 text-green-300 text-sm rounded-xl px-4 py-3">Settings saved successfully!</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {SECTIONS.map(({ title, fields }) => (
          <div key={title} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(({ key, label, textarea, full }) => (
                <div key={key} className={full ? "md:col-span-2" : ""}>
                  <label className={lbl}>{label}</label>
                  {textarea ? (
                    <textarea rows={2} value={settings[key] || ""} onChange={e => set(key, e.target.value)} className={tex} />
                  ) : (
                    <input type="text" value={settings[key] || ""} onChange={e => set(key, e.target.value)} className={inp} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <motion.button type="submit" disabled={saving} whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? "Saving…" : "Save All Settings"}
        </motion.button>
      </form>
    </div>
  );
}