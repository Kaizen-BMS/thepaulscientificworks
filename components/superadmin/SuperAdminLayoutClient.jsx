"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Users, Settings, Package, Tags, LogOut, Menu, X, Shield, ChevronRight } from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/superadmin", icon: LayoutDashboard, exact: true },
  { label: "Admins", href: "/superadmin/admins", icon: Users },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Settings", href: "/superadmin/settings", icon: Settings },
];

export default function SuperAdminLayoutClient({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", {
  credentials: "include",
}).then(r => r.json()).then(d => { if (d.user) setUser(d.user); }).catch(() => {});
  }, []);

  const isLogin = pathname === "/superadmin/login";
  if (isLogin) return <>{children}</>;

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/superadmin/login");
  };

  const NavItems = () => (
    <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
      {NAV.map(({ label, href, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} onClick={() => setSidebarOpen(false)}>
            <div className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl transition-all duration-150 group cursor-pointer ${active ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40" : "text-slate-400 hover:bg-slate-700/60 hover:text-white"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-[13px] font-medium">{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-200" />}
            </div>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className="hidden lg:flex flex-col w-56 bg-slate-900 border-r border-slate-800 flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-xs leading-tight">Super Admin</p>
            <p className="text-slate-400 text-[10px]">Full Access</p>
          </div>
        </div>
        <NavItems />
        <div className="p-3 border-t border-slate-800">
          {user && <div className="px-3 py-2 mb-1"><p className="text-white text-xs font-semibold truncate">{user.name}</p><p className="text-slate-400 text-[10px] truncate">{user.email}</p></div>}
          <button onClick={logout} className="flex items-center gap-2.5 w-full px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-xl transition-all text-[13px]">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -224 }} animate={{ x: 0 }} exit={{ x: -224 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed inset-y-0 left-0 w-56 bg-slate-900 border-r border-slate-800 z-50 flex flex-col lg:hidden">
              <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div>
                  <p className="text-white font-bold text-xs">Super Admin</p>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <NavItems />
              <div className="p-3 border-t border-slate-800">
                <button onClick={logout} className="flex items-center gap-2.5 w-full px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-xl transition-all text-[13px]">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white transition-colors"><Menu className="w-5 h-5" /></button>
          <div className="flex-1" />
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{user.name?.[0]}</span>
              </div>
              <span className="text-slate-300 text-xs hidden sm:block">{user.name}</span>
            </div>
          )}
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}