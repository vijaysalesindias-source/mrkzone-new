import React, { useState, useEffect } from 'react';
import { Zap, Percent } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import AmazonHeroCards from '../components/AmazonHeroCards';
import { productApi } from '../services/api';

export default function HomePage({ onNavigate }) {
  const [homepageProducts, setHomepageProducts] = useState([]);

  // Today's Deal Countdown Timer (Simulated to midnight)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load every active catalog product, including products added from Admin.
    // The featured/best-seller/trending endpoints omit products without those flags.
    let cancelled = false;
    productApi.getProducts({ page: 0, size: 12, sortBy: 'newest' })
      .then(res => {
        if (cancelled) return;
        const pageData = res?.data;
        setHomepageProducts(Array.isArray(pageData?.content) ? pageData.content : []);
      })
      .catch(error => {
        console.error('Failed to load homepage products:', error);
        if (!cancelled) setHomepageProducts([]);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-w-0 bg-[#e3e6e6] pb-12">
      {/* Keep the five hero banners exactly as they are. */}
      <AmazonHeroCards onNavigate={onNavigate} />

      {/* Product listing replaces all sections below the banners. */}
      <section className="max-w-[1500px] mx-auto px-4 mt-4 sm:mt-6">
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 rounded-lg text-rose-700">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Today's Lightning Deals</h2>
                  <span className="bg-amazon-dealRed text-white text-xs font-black px-2 py-0.5 rounded">Save up to 55%</span>
                </div>
                <p className="text-xs text-gray-500">Explore our latest products and limited-time deals</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-lg text-xs font-bold text-amber-900 shrink-0">
              <Zap className="w-4 h-4 text-amber-600 fill-current" />
              <span>Ends in:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded shadow-sm">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {homepageProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-4 items-stretch">
              {homepageProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} imagePriority={index < 2} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-gray-500">
              Products will appear here as soon as they are available.
            </div>
          )}
        </div>
      </section>
    </div>
  );

}
