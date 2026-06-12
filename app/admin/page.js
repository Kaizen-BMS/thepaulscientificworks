"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package, Tags, BookOpen, Quote, Inbox,
  ArrowRight, FlaskConical, TrendingUp, Plus,
  MessageSquare, Clock, CheckCircle
} from "lucide-react";

function StatCard({ icon: Icon, label, value, color, href, badge }) {
  const colors = {
    blue: "from-blue-600 to-blue-800",
    green: "from-emerald-600 to-emerald-800",
    purple: "from-violet-600 to-violet-800",
    orange: "from-orange-600 to-orange-800",
    red: "from-red-600 to-red-800",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }}
      className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden">
      <Link href={href || "#"}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color] || colors.blue} flex items-center justify-center shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            {badge > 0 && (
              <span className="text-[10px] font-bold bg-red-600 text-white rounded-full px-2 py-0.5">{badge} new</span>
            )}
          </div>
          <p className="text-slate-400 text-xs mb-1">{label}</p>
          <p className="text-3xl font-extrabold text-white">{value ?? "—"}</p>
        </div>
        <div className={`h-0.5 bg-gradient-to-r ${colors[color] || colors.blue}`} />
      </Link>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [enqStats, setEnqStats] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then(r => r.json()),
      fetch("/api/enquiries?page=1&limit=5").then(r => r.json()),
    ]).then(([s, e]) => {
      setStats(s.data);
      setEnqStats(e.stats);
      setRecentEnquiries(e.data || []);
    }).catch(() => {});
  }, []);

  const STATUS_COLORS = {
    new: "text-blue-400 bg-blue-900/40 border-blue-700/50",
    contacted: "text-yellow-400 bg-yellow-900/40 border-yellow-700/50",
    "quotation-sent": "text-purple-400 bg-purple-900/40 border-purple-700/50",
    completed: "text-green-400 bg-green-900/40 border-green-700/50",
    archived: "text-slate-400 bg-slate-700/60 border-slate-600/50",
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Paul Scientific Works — Admin Panel</p>
        </div>
        <Link href="/admin/products/new">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-md transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </motion.button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Package} label="Products" value={stats?.products} color="blue" href="/admin/products" />
        <StatCard icon={Tags} label="Categories" value={stats?.categories} color="green" href="/admin/categories" />
        <StatCard icon={BookOpen} label="Blog Posts" value={stats?.blogs} color="purple" href="/admin/blogs" />
        <StatCard icon={Quote} label="Testimonials" value={stats?.testimonials} color="orange" href="/admin/testimonials" />
        <StatCard icon={Inbox} label="Enquiries" value={enqStats?.total} color="red" href="/admin/enquiries" badge={enqStats?.new || 0} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Recent Enquiries */}
        <div className="md:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Inbox className="w-4 h-4 text-blue-400" />
              Recent Enquiries
              {enqStats?.new > 0 && <span className="text-[10px] font-bold bg-blue-600 text-white rounded-full px-1.5 py-0.5">{enqStats.new}</span>}
            </h2>
            <Link href="/admin/enquiries"><span className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></span></Link>
          </div>
          <div className="divide-y divide-slate-700/50">
            {recentEnquiries.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm">No enquiries yet</div>
            ) : recentEnquiries.map(enq => (
              <Link key={enq.id} href="/admin/enquiries">
                <div className="px-5 py-3.5 hover:bg-slate-700/30 transition-colors flex items-center gap-3 cursor-pointer">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${enq.status === "new" ? "bg-blue-900/60 text-blue-300 border border-blue-700/50" : "bg-slate-700 text-slate-400 border border-slate-600/50"}`}>
                    {enq.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{enq.name}</p>
                    <p className="text-xs text-slate-500 truncate">{enq.subject}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[enq.status] || ""}`}>
                    {enq.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Add New Product", href: "/admin/products/new", color: "text-blue-400" },
              { label: "New Blog Post", href: "/admin/blogs/new", color: "text-purple-400" },
              { label: "View Enquiries", href: "/admin/enquiries", color: "text-red-400" },
              { label: "Manage Categories", href: "/admin/categories", color: "text-green-400" },
              { label: "View Live Site", href: "/", color: "text-slate-300" },
            ].map(({ label, href, color }) => (
              <Link key={href} href={href} target={href === "/" ? "_blank" : undefined}>
                <div className="flex items-center justify-between px-3 py-2.5 bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700/40 rounded-xl transition-colors cursor-pointer group">
                  <span className={`text-sm font-medium ${color}`}>{label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </div>
              </Link>
            ))}
          </div>

          {/* Enquiry Status Breakdown */}
          {enqStats && (
            <div className="mt-5 pt-4 border-t border-slate-700">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Enquiry Status</p>
              <div className="space-y-2">
                {[
                  { key: "new", label: "New", color: "bg-blue-500", value: enqStats.new },
                  { key: "contacted", label: "Contacted", color: "bg-yellow-500", value: enqStats.contacted },
                  { key: "completed", label: "Completed", color: "bg-green-500", value: enqStats.completed },
                ].map(({ key, label, color, value }) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${color} flex-shrink-0`} />
                    <span className="text-xs text-slate-400 flex-1">{label}</span>
                    <span className="text-xs font-bold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}