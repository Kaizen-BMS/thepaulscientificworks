"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tags, FolderTree, Building2,
  Inbox, Quote, BookOpen, Award, Settings, LogOut, FlaskConical,
  ChevronRight
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Sub Categories", href: "/admin/subcategories", icon: FolderTree },
  { label: "Institution Types", href: "/admin/institutions", icon: Building2 },
  { label: "Inquiries", href: "/admin/inquiries", icon: Inbox },
  { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Certifications", href: "/admin/certifications", icon: Award },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ collapsed = false, onNavClick }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-slate-800">
      {/* Logo */}
      <div className={`border-b border-slate-700 flex items-center gap-3 px-4 py-4 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
          <FlaskConical className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-extrabold text-sm leading-tight">Paul Scientific</p>
            <p className="text-slate-400 text-[11px]">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onNavClick}>
              <div
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group
                  ${active ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "text-slate-300 hover:bg-slate-700 hover:text-white"}
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <Icon
                  className={`flex-shrink-0 transition-colors ${active ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                  style={{ width: 17, height: 17 }}
                />
                {!collapsed && (
                  <>
                    <span className="text-[13px] font-medium flex-1">{label}</span>
                    {active && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`border-t border-slate-700 p-3 ${collapsed ? "flex justify-center" : ""}`}>
        <Link href="/" target="_blank">
          <div className={`flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-slate-700 cursor-pointer ${collapsed ? "justify-center" : ""}`}>
            <LogOut style={{ width: 16, height: 16 }} className="flex-shrink-0" />
            {!collapsed && <span className="text-[12px] font-medium">View Live Site</span>}
          </div>
        </Link>
      </div>
    </div>
  );
}