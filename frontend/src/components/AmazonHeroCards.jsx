import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Truck, RefreshCw, Play, VolumeX, Pause, ShieldCheck, Tag } from 'lucide-react';

export default function AmazonHeroCards({ onNavigate }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full max-w-[1500px] mx-auto px-3 sm:px-4 pt-3 pb-2 group/carousel">
      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 snap-x snap-mandatory touch-auto"
      >
        {/* CARD 1: Everything under ₹499 (Orange with 3x3 product mosaic) */}
        <div
          onClick={() => onNavigate('listing', { deals: true })}
          className="w-[min(76vw,260px)] min-w-[min(76vw,260px)] max-w-[260px] h-[370px] sm:w-[285px] sm:min-w-[285px] sm:max-w-[285px] sm:h-[430px] rounded-2xl bg-gradient-to-b from-[#ff6200] via-[#ff5500] to-[#e64600] text-white p-4 flex flex-col justify-between shrink-0 shadow-sm cursor-pointer hover:shadow-md transition relative group overflow-hidden snap-start"
        >
          {/* Header */}
          <div>
            <h2 className="text-3xl font-black leading-tight tracking-tight">
              Everything<br />under ₹499
            </h2>
            <p className="text-sm font-semibold text-white/95 mt-1">
              Fashion, home & more
            </p>

            <div className="flex items-center justify-between text-[11px] text-white/90 mt-2.5 pt-2 border-t border-white/20 font-medium">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Free Delivery
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Quick Refunds
              </span>
            </div>
          </div>

          {/* 3x3 Colorful Product Grid */}
          <div className="grid grid-cols-3 gap-2 my-2">
            {/* 1. Watch */}
            <div className="h-16 rounded-lg bg-[#008a70] flex items-center justify-center p-1.5 shadow-xs">
              <img
                loading="eager"
                decoding="async"
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150"
                alt="Watch"
                className="max-h-full max-w-full object-contain filter drop-shadow"
              />
            </div>
            {/* 2. Jacket */}
            <div className="h-16 rounded-lg bg-[#c4618e] flex items-center justify-center p-1.5 shadow-xs">
              <img
                loading="eager"
                decoding="async"
                src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150"
                alt="Jacket"
                className="max-h-full max-w-full object-contain filter drop-shadow"
              />
            </div>
            {/* 3. Cookware Casserole */}
            <div className="h-16 rounded-lg bg-[#009b93] flex items-center justify-center p-1.5 shadow-xs">
              <img
                loading="eager"
                decoding="async"
                src="https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=150"
                alt="Cookware"
                className="max-h-full max-w-full object-contain filter drop-shadow"
              />
            </div>
            {/* 4. Handbag */}
            <div className="h-16 rounded-lg bg-[#dfceb7] flex items-center justify-center p-1.5 shadow-xs">
              <img
                loading="eager"
                decoding="async"
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150"
                alt="Bag"
                className="max-h-full max-w-full object-contain filter drop-shadow"
              />
            </div>
            {/* 5. Dollar Emoji */}
            <div className="h-16 rounded-lg bg-[#ffd200] flex items-center justify-center text-2xl shadow-xs">
              🤑
            </div>
            {/* 6. Lamp */}
            <div className="h-16 rounded-lg bg-[#ff9482] flex items-center justify-center p-1.5 shadow-xs">
              <img
                loading="eager"
                decoding="async"
                src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=150"
                alt="Lamp"
                className="max-h-full max-w-full object-contain filter drop-shadow"
              />
            </div>
            {/* 7. Gift Box */}
            <div className="h-16 rounded-lg bg-[#cfb6d8] flex items-center justify-center text-xl shadow-xs">
              🎉
            </div>
            {/* 8. Sport Jersey */}
            <div className="h-16 rounded-lg bg-[#80cbb5] flex items-center justify-center p-1.5 shadow-xs">
              <img
                loading="eager"
                decoding="async"
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150"
                alt="Tee"
                className="max-h-full max-w-full object-contain filter drop-shadow"
              />
            </div>
            {/* 9. Mist Spray */}
            <div className="h-16 rounded-lg bg-[#ff9138] flex items-center justify-center p-1.5 shadow-xs">
              <img
                loading="eager"
                decoding="async"
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=150"
                alt="Perfume"
                className="max-h-full max-w-full object-contain filter drop-shadow"
              />
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition">
              <RotateCcw className="w-3.5 h-3.5 text-white" />
            </span>
          </div>
        </div>

        {/* CARD 2: Under ₹399 Bestselling Kurtas */}
        <div
          onClick={() => onNavigate('listing', { categorySlug: 'fashion' })}
          className="w-[min(76vw,260px)] min-w-[min(76vw,260px)] max-w-[260px] h-[370px] sm:w-[285px] sm:min-w-[285px] sm:max-w-[285px] sm:h-[430px] rounded-2xl bg-slate-100 overflow-hidden flex flex-col justify-between shrink-0 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition relative group snap-start"
        >
          {/* Background Image of Kurtas */}
          <div className="absolute inset-0 z-0">
            <img
                loading="eager"
                decoding="async"
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600"
              alt="Bestselling Kurtas"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-[0.9]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
          </div>

          {/* Top Header */}
          <div className="relative z-10 p-4 text-white">
            <h2 className="text-3xl font-black drop-shadow-md tracking-tight leading-tight">
              Under ₹399
            </h2>
            <h3 className="text-lg font-bold drop-shadow-md">
              Bestselling kurtas
            </h3>
            <p className="text-xs text-gray-200 drop-shadow flex gap-2 mt-1">
              <span>Top brands</span>
              <span>•</span>
              <span>Latest trends</span>
            </p>
          </div>

          {/* Bottom Amazon Pay Cashback Strip */}
          <div className="relative z-10 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <div className="bg-white/95 rounded-lg p-2 text-gray-900 shadow-sm flex items-center gap-2 text-[11px]">
              <span className="bg-[#232f3e] text-white font-black text-[9px] px-1.5 py-0.5 rounded leading-none shrink-0">
                amazon pay
              </span>
              <div className="leading-tight">
                <span className="font-bold block">Unlimited 5% cashback*</span>
                <span className="text-[10px] text-gray-500">with Amazon Pay ICICI Bank credit card</span>
              </div>
            </div>
            <span className="text-[10px] text-white/70 block mt-1 ml-1">*T&C apply</span>
          </div>
        </div>

        {/* CARD 3: Starting ₹199 Laundry Essentials */}
        <div
          onClick={() => onNavigate('listing', { categorySlug: 'home-kitchen' })}
          className="w-[min(76vw,260px)] min-w-[min(76vw,260px)] max-w-[260px] h-[370px] sm:w-[285px] sm:min-w-[285px] sm:max-w-[285px] sm:h-[430px] rounded-2xl bg-amber-50/50 overflow-hidden flex flex-col justify-between shrink-0 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition relative group snap-start"
        >
          {/* Background Image: Laundry Hamper */}
          <div className="absolute inset-0 z-0">
            <img
                loading="eager"
                decoding="async"
              src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600"
              alt="Laundry Essentials"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-white/90" />
          </div>

          {/* Top Header */}
          <div className="relative z-10 p-4">
            <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tight">
              Starting ₹199
            </h2>
            <h3 className="text-lg font-bold text-gray-800">
              Laundry essentials
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded">
                KUBER INDUSTRIES
              </span>
              <span className="text-[10px] font-bold text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded">
                prettykrafts
              </span>
            </div>
          </div>

          {/* Bottom Strip */}
          <div className="relative z-10 p-3">
            <div className="bg-white/95 rounded-lg p-2 text-gray-900 shadow-sm border border-gray-200 flex items-center gap-2 text-[11px]">
              <span className="bg-[#232f3e] text-white font-black text-[9px] px-1.5 py-0.5 rounded leading-none shrink-0">
                amazon pay
              </span>
              <div className="leading-tight">
                <span className="font-bold block">Unlimited 5% cashback*</span>
                <span className="text-[10px] text-gray-500">with Amazon Pay ICICI Bank credit card</span>
              </div>
            </div>
            <span className="text-[10px] text-gray-600 block mt-1 ml-1">*T&C apply</span>
          </div>
        </div>

        {/* CARD 4: Win up to ₹300 back (FunZone) */}
        <div
          onClick={() => onNavigate('listing', { deals: true })}
          className="w-[min(76vw,260px)] min-w-[min(76vw,260px)] max-w-[260px] h-[370px] sm:w-[285px] sm:min-w-[285px] sm:max-w-[285px] sm:h-[430px] rounded-2xl bg-gradient-to-b from-[#e3f4fd] via-[#cae9fb] to-[#b3def6] overflow-hidden flex flex-col justify-between shrink-0 shadow-sm border border-sky-200 cursor-pointer hover:shadow-md transition relative group snap-start"
        >
          {/* Header */}
          <div className="p-4 z-10">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              Win up to
            </h2>
            <h1 className="text-3xl font-black text-gray-950 tracking-tight">
              ₹300 back
            </h1>
            <div className="mt-1 inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black italic text-xs px-2.5 py-0.5 rounded-full shadow-xs">
              FUN ZONE ⭐
            </div>
          </div>

          {/* Center: Spin Wheel & Phone Graphic */}
          <div className="relative h-48 flex items-center justify-center px-4">
            {/* Spinning Wheel CSS Graphic */}
            <div className="w-36 h-36 rounded-full border-4 border-white shadow-xl relative animate-spin-slow overflow-hidden bg-gradient-to-tr from-rose-500 via-amber-400 to-sky-500">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white shadow-md border-2 border-amber-400" />
              </div>
            </div>

            {/* Mobile Phone Mockup Overlay */}
            <div className="absolute right-4 w-24 h-40 bg-white rounded-xl shadow-2xl border-2 border-gray-800 overflow-hidden transform rotate-6 p-1">
              <img
                loading="eager"
                decoding="async"
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200"
                alt="Smartphone Prize"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Snowman badge */}
            <div className="absolute bottom-1 right-2 text-2xl">
              ⛄
            </div>
          </div>

          {/* Bottom */}
          <div className="p-3 flex items-center justify-between text-xs text-gray-700 z-10 border-t border-sky-300/60">
            <span className="text-[10px] text-gray-600">*Terms & conditions apply</span>
            <span className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center shadow-xs">
              <Pause className="w-3 h-3 text-gray-700" />
            </span>
          </div>
        </div>

        {/* CARD 5: Under ₹999 Everyday Kitchen Essentials */}
        <div
          onClick={() => onNavigate('listing', { categorySlug: 'home-kitchen' })}
          className="w-[min(76vw,260px)] min-w-[min(76vw,260px)] max-w-[260px] h-[370px] sm:w-[285px] sm:min-w-[285px] sm:max-w-[285px] sm:h-[430px] rounded-2xl bg-amber-50/40 overflow-hidden flex flex-col justify-between shrink-0 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition relative group snap-start"
        >
          {/* Background Kitchen Pots */}
          <div className="absolute inset-0 z-0">
            <img
                loading="eager"
                decoding="async"
              src="https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600"
              alt="Cookware"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-transparent to-black/70" />
          </div>

          {/* Top Header */}
          <div className="relative z-10 p-4">
            <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tight">
              Under ₹999
            </h2>
            <h3 className="text-lg font-bold text-gray-800">
              Everyday kitchen essentials
            </h3>
            <div className="flex gap-2 text-[11px] text-gray-700 mt-1 font-medium">
              <span>Free Delivery On first 3 orders*</span>
              <span>•</span>
              <span>Easy Returns</span>
            </div>
          </div>

          {/* Bottom Amazon Pay strip with Play/Mute controls */}
          <div className="relative z-10 p-3">
            <div className="bg-white/95 rounded-lg p-2 text-gray-900 shadow-sm flex items-center gap-2 text-[11px]">
              <span className="bg-[#232f3e] text-white font-black text-[9px] px-1.5 py-0.5 rounded leading-none shrink-0">
                amazon pay
              </span>
              <div className="leading-tight">
                <span className="font-bold block">Up to 10% savings*</span>
                <span className="text-[10px] text-gray-500">with Amazon Pay ICICI Bank credit card</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-[10px] text-white/80">*T&C apply</span>
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </span>
                <span className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
                  <VolumeX className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 6: Peeking Deal Card */}
        <div
          onClick={() => onNavigate('listing', { deals: true })}
          className="w-[120px] min-w-[120px] max-w-[120px] h-[370px] sm:w-[140px] sm:min-w-[140px] sm:max-w-[140px] sm:h-[430px] rounded-2xl bg-white p-4 flex flex-col justify-between shrink-0 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition relative group snap-start"
        >
          <div>
            <span className="bg-[#cc0c39] text-white text-[10px] font-black px-1.5 py-0.5 rounded">
              56% off
            </span>
            <h3 className="text-sm font-bold text-gray-900 mt-2">
              Blockbuster Deals
            </h3>
          </div>
          <span className="text-xs text-[#007185] font-bold">See more</span>
        </div>
      </div>

      {/* Floating Left Arrow Button for desktop/laptop */}
      <button
        onClick={scrollLeft}
        className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 w-10 h-20 bg-white/95 hover:bg-white text-gray-800 rounded-r-md shadow-2xl items-center justify-center transition border border-gray-300 z-20 hover:scale-105"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      {/* Floating Right Arrow Button for desktop/laptop matching screenshot */}
      <button
        onClick={scrollRight}
        className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 w-10 h-20 bg-white/95 hover:bg-white text-gray-800 rounded-l-md shadow-2xl items-center justify-center transition border border-gray-300 z-20 hover:scale-105"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
}
