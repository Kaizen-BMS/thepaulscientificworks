"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FlaskConical, Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }
      const role = data.user?.role;
      router.push(role === "superadmin" ? "/superadmin" : "/admin");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-900/50">
            <FlaskConical className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Paul Scientific Works</h1>
          <p className="text-slate-400 text-sm mt-1">Admin Panel</p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-6">Sign in to continue</h2>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 hover:border-slate-500 focus:border-blue-500 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-11 py-3 bg-slate-900 border border-slate-600 hover:border-slate-500 focus:border-blue-500 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-900/50 mt-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign In"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}