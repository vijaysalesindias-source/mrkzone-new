import React, { useState, useEffect } from 'react';
import { resolveMediaUrl } from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSlider({ banners = [], onNavigate }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const defaultBanners = [
    {
      title: "Amazon Great Indian Festival Sale",
      subtitle: "Up to 60% OFF on Flagship Smartphones, Laptops & Premium Audio",
      imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600",
      buttonText: "Explore Deals",
      tag: "Mega Deals",
      targetCategory: "electronics"
    },
    {
      title: "Next-Gen 5G Smartphones Festival",
      subtitle: "Exchange bonus up to ₹10,000 + Instant Bank Discounts with No Cost EMI",
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600",
      buttonText: "Shop Smartphones",
      tag: "Top Offers",
      targetCategory: "smartphones"
    },
    {
      title: "Unbeatable Audio & Noise Cancelling",
      subtitle: "Hear every note in high fidelity with Sony, Apple, and boAt sound systems",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600",
      buttonText: "Discover Audio",
      tag: "Trending",
      targetCategory: "audio-headphones"
    }
  ];

  const activeBanners = banners.length > 0 ? banners : defaultBanners;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const currentBanner = activeBanners[currentIndex];

  return (
    <div className="relative w-full overflow-hidden bg-gray-900 group select-none">
      {/* Banner Image & Content */}
      <div className="relative h-[240px] sm:h-[340px] md:h-[420px] lg:h-[480px] w-full transition-all duration-700">
        <img
          src={resolveMediaUrl(currentBanner.imageUrl)}
          alt={currentBanner.title}
          className="w-full h-full object-cover object-center filter brightness-[0.75]"
        />

        {/* Banner Text Overlay */}
        <div className="absolute inset-0 max-w-[1500px] mx-auto px-6 sm:px-12 flex flex-col justify-center items-start text-white">
          {currentBanner.tag && (
            <span className="bg-amber-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              {currentBanner.tag}
            </span>
          )}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold max-w-2xl leading-tight drop-shadow-md">
            {currentBanner.title}
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-gray-200 mt-2 max-w-xl drop-shadow">
            {currentBanner.subtitle}
          </p>
          <button
            onClick={() => {
              if (currentBanner.targetCategory) {
                onNavigate('listing', { categorySlug: currentBanner.targetCategory });
              } else {
                onNavigate('listing');
              }
            }}
            className="mt-4 bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold px-6 py-2.5 rounded-full shadow-lg transition transform hover:scale-105 text-sm"
          >
            {currentBanner.buttonText || "Shop Now"}
          </button>
        </div>
      </div>

      {/* Left / Right Chevron Nav Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-black/30 hover:bg-black/60 text-white transition focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-black/30 hover:bg-black/60 text-white transition focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-16 sm:bottom-28 left-0 right-0 flex justify-center gap-2">
        {activeBanners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentIndex ? 'bg-amazon-yellow w-7' : 'bg-white/60 hover:bg-white'
            }`}
          />
        ))}
      </div>

      {/* Amazon Gradient Mask that merges with product cards */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-36 bg-gradient-to-t from-[#eaeded] via-[#eaeded]/80 to-transparent pointer-events-none" />
    </div>
  );
}
