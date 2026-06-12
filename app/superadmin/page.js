"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Tags, Users, ArrowRight, Shield } from "lucide-react";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, admins: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
      fetch("/api/admins").then(r => r.json()),
    ]).then(([prod, cats, adms]) => {
      setStats({ products: prod.total || 0, categories: cats.data?.length || 0, admins: adms.data?.length || 0 });
    }).catch(() => {});
  }, []);

  const cards = [
    { icon: Package, label: "Products", value: stats.products, href: "/admin/products", color: "from-blue-600 to-blue-800" },
    { icon: Tags, label: "Categories", value: stats.categories, href: "/admin/categories", color: "from-emerald-600 to-emerald-800" },
    { icon: Users, label: "Admins", value: stats.admins, href: "/superadmin/admins", color: "from-indigo-600 to-indigo-800" },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2"><Shield className="w-6 h-6 text-indigo-400" />Super Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-0.5">Full system control</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {cards.map(({ icon: Icon, label, value, href, color }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden">
            <Link href={href}>
              <div className="p-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-slate-400 text-xs mb-1">{label}</p>
                <p className="text-3xl font-extrabold text-white">{value}</p>
              </div>
              <div className={`h-0.5 bg-gradient-to-r ${color}`} />
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-4">Quick Actions</h2>
        <div className="space-y-2">
          {[
            { label: "Manage Admins", href: "/superadmin/admins" },
            { label: "Website Settings", href: "/superadmin/settings" },
            { label: "Add Product", href: "/admin/products/new" },
            { label: "Manage Categories", href: "/admin/categories" },
            { label: "View Live Site", href: "/products" },
          ].map(({ label, href }) => (
            <Link key={href} href={href} target={href === "/products" ? "_blank" : undefined}>
              <div className="flex items-center justify-between px-3 py-2.5 bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700/40 rounded-xl transition-colors cursor-pointer group">
                <span className="text-sm font-medium text-slate-300">{label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}