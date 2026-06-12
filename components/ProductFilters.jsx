"use client";
import { useEffect, useRef } from "react";
import { Search, X, Filter, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919999999999";

export default function ProductFilters({
  search, setSearch,
  institutions, categories, subcategories,
  selectedInstitution, setSelectedInstitution,
  selectedCategory, setSelectedCategory,
  selectedSubcategory, setSelectedSubcategory,
  onClear,
}) {
  const searchRef = useRef(null);

  const filteredCats = selectedInstitution
    ? categories.filter((c) => String(c.institutionTypeId) === String(selectedInstitution))
    : categories;

  const filteredSubs = selectedCategory
    ? subcategories.filter((s) => String(s.categoryId) === String(selectedCategory))
    : subcategories;

  const hasFilters = search || selectedInstitution || selectedCategory || selectedSubcategory;

  const inp = "w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all";
  const lbl = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="h-full flex flex-col gap-5 overflow-y-auto pb-6">
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5" /> Filter Products
        </p>
      </div>

      {/* Search */}
      <div>
        <label className={lbl}>Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or product code..."
            className={`${inp} pl-8`}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
      </div>

      {/* Institution */}
      <div>
        <label className={lbl}>Institution Type</label>
        <select
          value={selectedInstitution}
          onChange={(e) => { setSelectedInstitution(e.target.value); setSelectedCategory(""); setSelectedSubcategory(""); }}
          className={inp}
        >
          <option value="">All Types</option>
          {institutions.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className={lbl}>Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubcategory(""); }}
          className={inp}
        >
          <option value="">All Categories</option>
          {filteredCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Subcategory */}
      <div>
        <label className={lbl}>Sub Category</label>
        <select
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          className={inp}
        >
          <option value="">All Sub Categories</option>
          {filteredSubs.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="w-full py-2.5 text-sm text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-semibold"
        >
          Clear All Filters
        </button>
      )}

      {/* Divider */}
  
<div className="border-t border-slate-100 pt-4">
  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
    <p className="text-[12px] font-bold text-green-800 mb-1">
      Need Help?
    </p>

    <p className="text-[11px] text-green-700 mb-3 leading-relaxed">
      Chat with our team for bulk orders and custom quotes.
    </p>

    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello, I need help with your product catalogue.`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-[12px] font-bold py-2.5 rounded-xl transition-colors w-full"
    >
      <MessageCircle className="w-3.5 h-3.5" />
      <span>WhatsApp Us</span>
    </a>
  </div>
</div>
  </div>
  );
}