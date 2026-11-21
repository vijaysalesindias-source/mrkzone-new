import React from 'react';
import { Menu, ChevronDown, Sparkles } from 'lucide-react';

export default function CategoryBar({ onNavigate, onOpenCategoryDrawer }) {
  const categoryLinks = [
    { label: "Amazon Pay" },
    { label: "Mobiles", slug: 'smartphones' },
    { label: "Prime" },
    { label: "Today's Deals" },
    { label: "Coupons" },
    { label: "Flights" },
    { label: "Fresh" },
    { label: "Grocery & Gourmet Foods" },
    { label: "Electronics" },
    { label: "New Releases" },
  ];

  return (
    <nav className="bg-[#232f3e] text-white text-xs font-normal border-t border-slate-700 overflow-x-auto no-scrollbar">
      <div className="max-w-[1500px] mx-auto px-4 flex items-center justify-between h-[39px] gap-2 shrink-0">
        <div className="flex items-center gap-0.5 shrink-0">
          {/* All Menu Button */}
          <span aria-disabled="true" className="flex items-center gap-1 px-2 py-1 font-bold">
            <Menu className="w-4 h-4" />
            <span>All</span>
          </span>

          {/* Category Links */}
          {categoryLinks.map((item, idx) => (
            item.slug ? (
              <button
                key={idx}
                onClick={() => onNavigate('listing', { categorySlug: item.slug })}
                className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition whitespace-nowrap flex items-center gap-1 text-white"
              >
                <span>{item.label}</span>
              </button>
            ) : (
              <span key={idx} aria-disabled="true" className="px-2 py-1 whitespace-nowrap text-white/90 cursor-default">
                {item.label}
              </span>
            )
          ))}
        </div>

        {/* Right Promo: Travel Deals Banner matching screenshot */}
        <div
          aria-disabled="true"
          className="hidden xl:flex items-center gap-2 bg-[#002f5e] text-white px-3 py-1 rounded shrink-0 border border-sky-600/40"
        >
          <span className="text-cyan-400 font-black tracking-tight text-[11px] flex items-center gap-1">
            ✈️ IMPOSSIBLE TRAVEL DEALS
          </span>
          <span className="text-white text-[11px] font-medium">
            Up to 30% off* on flights
          </span>
          <span className="bg-[#ff9900] text-black font-black text-[9px] px-1 py-0.2 rounded leading-none">
            pay
          </span>
        </div>
      </div>
    </nav>
  );
}
