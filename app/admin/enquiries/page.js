"use client";
import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox, Search, X, Eye, Trash2, Loader2,
  CheckCircle, Clock, Send, Archive, MessageSquare,
  Phone, Mail, Building2, Calendar, Tag, Filter, ChevronLeft, ChevronRight
} from "lucide-react";

const STATUS_CONFIG = {
  new: { label: "New", color: "bg-blue-900/50 text-blue-300 border-blue-700/60", dot: "bg-blue-400" },
  contacted: { label: "Contacted", color: "bg-yellow-900/50 text-yellow-300 border-yellow-700/60", dot: "bg-yellow-400" },
  "quotation-sent": { label: "Quotation Sent", color: "bg-purple-900/50 text-purple-300 border-purple-700/60", dot: "bg-purple-400" },
  completed: { label: "Completed", color: "bg-green-900/50 text-green-300 border-green-700/60", dot: "bg-green-400" },
  archived: { label: "Archived", color: "bg-slate-700/80 text-slate-400 border-slate-600/60", dot: "bg-slate-500" },
};

const SOURCE_CONFIG = {
  "contact-form": { label: "Contact Form", color: "text-blue-400" },
  "product-page": { label: "Product Page", color: "text-emerald-400" },
  "whatsapp-enquiry": { label: "WhatsApp", color: "text-green-400" },
  "quote-request": { label: "Quote Request", color: "text-purple-400" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function formatDate(str) {
  if (!str) return "";
  try {
    return new Date(str).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return str; }
}

function EnquiryDetailModal({ enquiry, onClose, onStatusChange, onDelete }) {
  const [status, setStatus] = useState(enquiry.status);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await onStatusChange(enquiry.id, newStatus);
    setStatus(newStatus);
    setUpdating(false);
  };

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-4 border-b border-slate-700 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-[10px] font-bold text-slate-400">{enquiry.id}</span>
              <StatusBadge status={status} />
            </div>
            <h3 className="font-bold text-white text-sm">{enquiry.subject}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Customer Info */}
          <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Customer Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 text-xs font-bold">{enquiry.name?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{enquiry.name}</p>
                  {enquiry.company && <p className="text-slate-400 text-xs">{enquiry.company}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                {enquiry.email && (
                  <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors">
                    <Mail className="w-3 h-3" />{enquiry.email}
                  </a>
                )}
                {enquiry.phone && (
                  <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors">
                    <Phone className="w-3 h-3" />{enquiry.phone}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Product Info (if applicable) */}
          {enquiry.productName && (
            <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl p-4">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">Product Enquiry</p>
              <p className="text-sm font-semibold text-white">{enquiry.productName}</p>
              {enquiry.productId && <p className="text-xs text-blue-400 font-mono mt-0.5">{enquiry.productId}</p>}
            </div>
          )}

          {/* Message */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Message</p>
            <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-4">
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{enquiry.message}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(enquiry.createdAt)}</span>
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span className={SOURCE_CONFIG[enquiry.source]?.color || "text-slate-400"}>
                {SOURCE_CONFIG[enquiry.source]?.label || enquiry.source}
              </span>
            </span>
          </div>
        </div>

        {/* Footer: Status Controls */}
        <div className="px-5 py-4 border-t border-slate-700 flex-shrink-0 bg-slate-900/40">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Update Status</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button key={key} disabled={updating || status === key} onClick={() => handleStatusChange(key)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all disabled:cursor-not-allowed ${status === key ? cfg.color + " opacity-100" : "border-slate-600 text-slate-400 hover:border-slate-400 disabled:opacity-40"}`}>
                {updating && status !== key ? <Loader2 className="w-3 h-3 animate-spin inline" /> : cfg.label}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 mt-4">
            {enquiry.email && (
              <a href={`mailto:${enquiry.email}?subject=Re: ${enquiry.subject}`}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-700/50 text-blue-400 text-xs font-semibold rounded-xl transition-colors">
                <Mail className="w-3.5 h-3.5" /> Reply via Email
              </a>
            )}
            {enquiry.phone && (
              <a href={`https://wa.me/${enquiry.phone.replace(/\D/g, "")}?text=Hi ${enquiry.name}, regarding your enquiry: ${enquiry.subject}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-green-600/20 hover:bg-green-600/40 border border-green-700/50 text-green-400 text-xs font-semibold rounded-xl transition-colors">
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </a>
            )}
            <button onClick={() => { onDelete(enquiry.id); onClose(); }}
              className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-800/50 text-red-400 text-xs font-semibold rounded-xl transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const EnquiryRow = memo(function EnquiryRow({ enquiry, onClick }) {
  return (
    <tr onClick={onClick}
      className={`border-b border-slate-700/50 cursor-pointer group transition-colors duration-100 hover:bg-slate-700/30 ${enquiry.status === "new" ? "bg-blue-950/20" : ""}`}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${enquiry.status === "new" ? "bg-blue-900/60 text-blue-300 border border-blue-700/50" : "bg-slate-700 text-slate-400 border border-slate-600/50"}`}>
            {enquiry.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight truncate max-w-[140px]">{enquiry.name}</p>
            {enquiry.company && <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{enquiry.company}</p>}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <p className="text-sm text-slate-300 line-clamp-1">{enquiry.subject}</p>
        {enquiry.productName && <p className="text-[10px] text-blue-400 font-mono mt-0.5">{enquiry.productName}</p>}
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <p className="text-xs text-slate-400 truncate max-w-[160px]">{enquiry.email}</p>
        {enquiry.phone && <p className="text-[10px] text-slate-500 mt-0.5">{enquiry.phone}</p>}
      </td>
      <td className="px-4 py-3 hidden xl:table-cell">
        <span className={`text-[10px] font-semibold ${SOURCE_CONFIG[enquiry.source]?.color || "text-slate-500"}`}>
          {SOURCE_CONFIG[enquiry.source]?.label || enquiry.source}
        </span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={enquiry.status} />
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <p className="text-[10px] text-slate-500">{formatDate(enquiry.createdAt)}</p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end">
          <div className="p-1.5 text-slate-500 group-hover:text-blue-400 bg-transparent group-hover:bg-blue-900/30 border border-transparent group-hover:border-blue-800/40 rounded-lg transition-all">
            <Eye className="w-3.5 h-3.5" />
          </div>
        </div>
      </td>
    </tr>
  );
});

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) p.set("search", search);
    if (statusFilter) p.set("status", statusFilter);
    fetch(`/api/enquiries?${p}`)
      .then(r => r.json())
      .then(d => {
        setEnquiries(d.data || []);
        setTotal(d.total || 0);
        setTotalPages(d.totalPages || 1);
        if (d.stats) setStats(d.stats);
      })
      .finally(() => setLoading(false));
  }, [search, statusFilter, page]);

  useEffect(() => {
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load]);

  const handleStatusChange = async (id, status) => {
    await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this enquiry?")) return;
    setDeleting(id);
    await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    setDeleting(null);
    if (selected?.id === id) setSelected(null);
    load();
  };

  const newCount = stats?.new || 0;

  return (
    <>
      <AnimatePresence>
        {selected && (
          <EnquiryDetailModal
            enquiry={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Inbox className="w-6 h-6 text-blue-400" />
              Enquiries
              {newCount > 0 && (
                <span className="text-[11px] font-bold bg-blue-600 text-white rounded-full px-2 py-0.5 ml-1">
                  {newCount} new
                </span>
              )}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">{total} total enquiries</p>
          </div>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => { setStatusFilter(statusFilter === key ? "" : key); setPage(1); }}
                className={`p-3 rounded-xl border transition-all text-left ${statusFilter === key ? `${cfg.color} shadow-md` : "bg-slate-800/60 border-slate-700/60 hover:border-slate-600"}`}>
                <p className={`text-xl font-extrabold ${statusFilter === key ? "" : "text-white"}`}>{stats[key === "quotation-sent" ? "quotationSent" : key] || 0}</p>
                <p className={`text-[10px] font-semibold mt-0.5 ${statusFilter === key ? "" : "text-slate-400"}`}>{cfg.label}</p>
              </button>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email, phone, subject…"
              className="w-full pl-9 pr-9 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"><X className="w-3.5 h-3.5" /></button>}
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="pl-9 pr-8 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 text-slate-300 rounded-xl text-sm focus:outline-none appearance-none cursor-pointer transition-all min-w-[140px]">
              <option value="">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          {(search || statusFilter) && (
            <button onClick={() => { setSearch(""); setStatusFilter(""); setPage(1); }}
              className="flex items-center gap-1.5 text-xs text-red-400 border border-red-900/60 bg-red-900/20 hover:bg-red-900/40 rounded-lg px-3 py-2.5 font-semibold transition-colors">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-20">
              <Inbox className="w-14 h-14 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 font-medium text-sm">No enquiries found</p>
              {(search || statusFilter) && <p className="text-slate-500 text-xs mt-1">Try clearing your filters</p>}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Customer</th>
                      <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Subject</th>
                      <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Contact</th>
                      <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 hidden xl:table-cell">Source</th>
                      <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                      <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Date</th>
                      <th className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map(enq => (
                      <EnquiryRow key={enq.id} enquiry={enq} onClick={() => setSelected(enq)} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
                  <p className="text-xs text-slate-500">Page {page} of {totalPages} · {total} total</p>
                  <div className="flex gap-2">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                      className="p-2 rounded-lg border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                      className="p-2 rounded-lg border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}