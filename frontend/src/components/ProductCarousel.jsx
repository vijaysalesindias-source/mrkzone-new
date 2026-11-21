import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductCarousel({ title, subtitle, products = [], onNavigate, seeAllQuery }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 my-6 relative group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {seeAllQuery && (
            <button
              onClick={() => onNavigate('listing', seeAllQuery)}
              className="text-xs sm:text-sm text-amazon-link hover:text-amazon-linkHover font-semibold hover:underline"
            >
              See all deals
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100 transition shadow-sm text-gray-700"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100 transition shadow-sm text-gray-700"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1 snap-x snap-mandatory touch-pan-x"
      >
        {products.map((product) => (
          <div key={product.id} className="w-[68vw] min-w-[210px] max-w-[240px] sm:w-[260px] sm:min-w-[260px] sm:max-w-[260px] shrink-0 snap-start">
            <ProductCard product={product} onNavigate={onNavigate} />
          </div>
        ))}
      </div>
    </section>
  );
}
