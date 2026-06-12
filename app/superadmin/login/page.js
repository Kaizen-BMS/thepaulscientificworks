"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(form),
});
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }
      if (data.user?.role !== "superadmin") { setError("Access denied. Superadmin only."); return; }
      setTimeout(() => {
  window.location.href = "/superadmin";
}, 300);
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-900/50">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Super Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Paul Scientific Works</p>
        </div>
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-8 shadow-2xl">
          {error && <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 hover:border-slate-500 focus:border-indigo-500 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                  placeholder="superadmin@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type={showPass ? "text" : "password"} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-11 py-3 bg-slate-900 border border-slate-600 hover:border-slate-500 focus:border-indigo-500 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-indigo-900/50 mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign In as Superadmin"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}