import React from 'react';
import { X, User, ChevronRight, Zap, Flame, ShieldAlert, LogOut, Package, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CategoryDrawer({ isOpen, onClose, onNavigate }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  if (!isOpen) return null;

  const handleCategoryClick = (slug) => {
    onClose();
    onNavigate('listing', { categorySlug: slug });
  };

  const handleSpecialClick = (key) => {
    onClose();
    if (key === 'deals') onNavigate('listing', { deals: true });
    else if (key === 'best-sellers') onNavigate('listing', { bestSeller: true });
    else if (key === 'trending') onNavigate('listing', { trending: true });
    else if (key === 'orders') onNavigate('account', { tab: 'orders' });
    else if (key === 'wishlist') onNavigate('account', { tab: 'wishlist' });
    else if (key === 'admin') onNavigate('admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative bg-white w-full max-w-xs sm:max-w-sm h-full shadow-2xl flex flex-col z-10 overflow-y-auto thin-scrollbar animate-slide-right">

        {/* Drawer Header */}
        <div className="bg-amazon-blue text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div
            onClick={() => {
              onClose();
              onNavigate('account');
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white border border-slate-500">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-300 block">Hello,</span>
              <span className="font-bold text-base text-white">
                Customer
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Sections */}
        <div className="p-4 space-y-6 text-sm text-gray-800">

          {/* Trending Section */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 px-3 mb-2">
              Trending & Deals
            </h4>
            <div className="space-y-0.5">
              <button
                onClick={() => handleSpecialClick('deals')}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-100 rounded-lg text-left"
              >
                <span className="font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 fill-current" /> Today's Mega Deals
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => handleSpecialClick('best-sellers')}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-100 rounded-lg text-left"
              >
                <span className="font-medium flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-600 fill-current" /> Best Sellers
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => handleSpecialClick('trending')}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-100 rounded-lg text-left"
              >
                <span className="font-medium">New Releases & Trending</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="border-t" />

          {/* Shop By Category */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 px-3 mb-2">
              Shop by Department
            </h4>
            <div className="space-y-0.5">
              {[
                { name: 'Electronics & Home Entertainment', slug: 'electronics' },
                { name: 'Smartphones & Accessories', slug: 'smartphones' },
                { name: 'Computers & Laptops', slug: 'laptops-computers' },
                { name: 'Audio, Headphones & TWS', slug: 'audio-headphones' },
                { name: 'Smartwatches & Wearables', slug: 'smartwatches' },
                { name: 'Fashion & Apparel', slug: 'fashion' },
                { name: 'Footwear & Running Shoes', slug: 'footwear' },
                { name: 'Home & Kitchen Appliances', slug: 'home-kitchen' },
              ].map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-100 rounded-lg text-left"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="border-t" />

          {/* Help & Settings */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 px-3 mb-2">
              Help & Settings
            </h4>
            <div className="space-y-0.5">
              <button
                onClick={() => handleSpecialClick('orders')}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-100 rounded-lg text-left"
              >
                <span className="flex items-center gap-2"><Package className="w-4 h-4 text-gray-500" /> Your Orders</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => handleSpecialClick('wishlist')}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-100 rounded-lg text-left"
              >
                <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-gray-500" /> Your Wishlist</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleSpecialClick('admin')}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg text-left"
                >
                  <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-amber-600" /> Admin Control Panel</span>
                  <ChevronRight className="w-4 h-4 text-amber-600" />
                </button>
              )}

              <button
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-rose-50 text-rose-600 font-medium rounded-lg text-left"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
