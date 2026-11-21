import React, { useState, useEffect, useRef } from 'react';
import {
  Search, ShoppingCart, MapPin, User, Heart, Menu, X, ChevronDown,
  LogOut, ShieldAlert, Package, Bell, Sparkles, ExternalLink
} from 'lucide-react';
import AmazonLogo from './AmazonLogo';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { metaApi, productApi } from '../services/api';

export default function Navbar({ onNavigate, onOpenPincodeModal, onOpenCategoryDrawer }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems, deliveryPincode, deliveryInfo } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({ code: 'EN', name: 'English' });

  const searchBoxRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const accountRef = useRef(null);

  useEffect(() => {
    metaApi.getCategories()
      .then(res => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  const POPULAR_SEARCHES = [
    "iPhone 15 Pro",
    "Wireless Bluetooth Earbuds",
    "Smart Watch for Men & Women",
    "Running Shoes & Sneakers",
    "Fire TV Stick 4K with Alexa",
    "Echo Dot 5th Gen Smart Speaker",
    "Silent Wireless Keyboard and Mouse",
    "Air Fryer & Kitchen Cookware",
    "Bestselling Kurtas & Apparel",
    "California Whole Almonds 500g"
  ];

  // Autocomplete debounced search - Instant options for whatever the user types
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length >= 1) {
      const timer = setTimeout(() => {
        productApi.getSuggestions(q)
          .then(res => {
            const list = res.data || [];
            if (list.length > 0) {
              setSuggestions(list);
            } else {
              setSuggestions([
                `${q} in All Categories`,
                `${q} under 499`,
                `${q} deals`,
                `${q} new arrivals`,
                `${q} for men`,
                `${q} for home`
              ]);
            }
          })
          .catch(() => {
            setSuggestions([
              `${q} in All Categories`,
              `${q} under 499`,
              `${q} deals`,
              `${q} new arrivals`
            ]);
          });
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSuggestions(POPULAR_SEARCHES);
    }
  }, [searchQuery]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      const outsideDesktop = !searchBoxRef.current || !searchBoxRef.current.contains(event.target);
      const outsideMobile = !mobileSearchRef.current || !mobileSearchRef.current.contains(event.target);
      if (outsideDesktop && outsideMobile) {
        setShowSuggestions(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    onNavigate('listing', {
      keyword: searchQuery.trim(),
      categoryId: selectedCategory !== 'all' ? selectedCategory : undefined
    });
  };

  const handleSuggestionClick = (text) => {
    const cleanText = text.replace(/ in All Categories| under 499| deals today| deals| new arrivals| top rated/gi, '').trim();
    setSearchQuery(cleanText);
    setShowSuggestions(false);
    onNavigate('listing', { keyword: cleanText });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#131921] text-white text-sm">
      {/* 1. Desktop & Laptop Header Bar (hidden md:flex) */}
      <div className="w-full mx-auto px-4 py-1 hidden md:flex items-center gap-2 justify-between min-h-[68px]">

        {/* Amazon Brand Logo — proportioned to match the supplied reference */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center px-1 py-1 rounded hover:ring-1 hover:ring-white text-left transition shrink-0"
          aria-label="Amazon Home"
        >
          <AmazonLogo variant="white" className="h-8 w-auto" />
        </button>

        {/* Deliver To PIN Code Selector */}
        <button
          onClick={onOpenPincodeModal}
          className="hidden lg:flex items-center gap-1.5 px-1 py-1.5 rounded hover:ring-1 hover:ring-white text-left transition shrink-0 min-w-[230px]"
        >
          <MapPin className="w-4 h-4 text-white shrink-0 mt-1.5" />
          <div className="leading-tight">
            <span className="text-[#ccc] block text-[12px]">
              Delivering to {deliveryInfo ? `${deliveryInfo.zoneName.split(' ')[0]} ${deliveryPincode}` : `Pratapgarh ${deliveryPincode}`}
            </span>
            <span className="font-bold text-white text-[14px] block -mt-0.5">
              Update location
            </span>
          </div>
        </button>

        {/* Large Amazon-style Search Bar with Autocomplete */}
        <div ref={searchBoxRef} className="flex-[1_1_auto] min-w-[360px] relative">
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
            {/* Category Dropdown */}
            <div className="hidden sm:flex relative bg-[#e6e6e6] hover:bg-[#d4d4d4] text-[#0f1111] rounded-l-md border-r border-gray-300 text-xs font-normal cursor-pointer transition h-[42px] items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-transparent h-full py-1 pl-2 pr-5 text-[12px] cursor-pointer focus:outline-none min-w-[52px]"
              >
                <option value="all">All</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600" />
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (suggestions.length === 0) setSuggestions(POPULAR_SEARCHES);
                setShowSuggestions(true);
              }}
              placeholder="Search Amazon.in"
              className="w-full min-w-0 h-[42px] py-2 px-3 text-[14px] text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#f90] rounded-l-md sm:rounded-l-none placeholder-gray-500"
            />

            {/* Search Button */}
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 px-3 h-[42px] rounded-r-md transition flex items-center justify-center shrink-0"
              aria-label="Search"
            >
              <Search className="w-6 h-6 text-gray-900" />
            </button>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white text-gray-900 rounded-md shadow-2xl border border-gray-200 overflow-hidden z-50">
              <div className="text-[11px] font-bold text-gray-400 px-4 py-1.5 uppercase tracking-wider bg-gray-50 border-b">
                Suggestions
              </div>
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full text-left px-4 py-2.5 hover:bg-amber-50 flex items-center gap-2.5 text-sm border-b last:border-b-0 transition"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-800">{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">

          {/* Country / Language selector */}
          <div className="hidden xl:block relative">
            <button
              type="button"
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              aria-expanded={languageDropdownOpen}
              aria-label="Select language"
              className="flex items-center gap-1 px-1.5 py-1 rounded hover:ring-1 hover:ring-white font-bold text-[13px] text-white whitespace-nowrap"
            >
              <span className="text-base">🇮🇳</span>
              <span>{selectedLanguage.code}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            {languageDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-md bg-white text-[#0f1111] shadow-2xl border border-gray-200 py-2 z-[60]">
                <div className="px-3 pb-2 mb-1 border-b border-gray-200 text-xs font-bold text-gray-500">Select your language</div>
                {[
                  { code: 'EN', name: 'English' },
                  { code: 'हिं', name: 'हिन्दी' },
                  { code: 'த', name: 'தமிழ்' },
                  { code: 'తె', name: 'తెలుగు' },
                  { code: 'ಕ', name: 'ಕನ್ನಡ' },
                  { code: 'മ', name: 'മലയാളം' },
                  { code: 'বাং', name: 'বাংলা' },
                  { code: 'મ', name: 'ગુજરાતી' },
                  { code: 'मर', name: 'मराठी' }
                ].map((language) => (
                  <button
                    key={language.name}
                    type="button"
                    onClick={() => { setSelectedLanguage(language); setLanguageDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-amber-50 ${selectedLanguage.name === language.name ? 'font-bold text-[#c45500]' : ''}`}
                  >
                    <span>{language.name}</span>
                    {selectedLanguage.name === language.name && <span aria-hidden="true">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Customer Header - Display Only */}
          <div className="px-2 py-1.5 rounded text-left text-sm cursor-default">
            <div className="leading-tight">
              <span className="text-[#ccc] block text-[12px]">
                Hello, sign in
              </span>
              <span className="font-bold text-white text-[14px] whitespace-nowrap">
                Account & Lists
              </span>
            </div>
          </div>

          {/* Admin access preserved separately */}
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="px-2 py-1.5 rounded hover:ring-1 hover:ring-white text-left text-sm font-bold"
          >
            {isAdmin ? 'Admin Panel' : 'Admin Login'}
          </button>

          {/* Returns & Orders - Display Only */}
          <div className="hidden sm:block px-2 py-1.5 text-left text-sm cursor-default">
            <div className="leading-tight">
              <span className="text-[#ccc] block text-[12px]">Returns</span>
              <span className="font-bold text-white block text-[14px]">& Orders</span>
            </div>
          </div>

          {/* Cart with Trolley Icon & Badge */}
          <button
            onClick={() => onNavigate('cart')}
            className="flex items-end gap-1 px-2 py-1.5 rounded hover:ring-1 hover:ring-white text-left transition shrink-0"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <span className="absolute -top-1.5 left-3 text-[#f08804] font-black text-sm">
                {totalItems}
              </span>
              <ShoppingCart className="w-9 h-9 text-white" />
            </div>
            <span className="hidden sm:inline font-bold text-[14px] text-white pb-0.5">
              Cart
            </span>
          </button>
        </div>
      </div>

      {/* Amazon-style secondary navigation row from the supplied reference */}
      <nav className="hidden md:flex h-[40px] items-center justify-between gap-4 bg-[#232f3e] px-4 text-white overflow-hidden">
        <div className="flex min-w-0 items-center gap-5 whitespace-nowrap text-[14px]">
          <span aria-disabled="true" className="flex items-center gap-1 font-bold px-1 py-1"><Menu className="h-5 w-5" />All</span>
          <span className="px-1 py-1">Amazon Pay</span>
          <button onClick={() => onNavigate('listing', { categorySlug: 'smartphones' })} className="hover:outline hover:outline-1 hover:outline-white px-1 py-1 rounded">Mobiles</button>
          <span className="px-1 py-1">Prime⌄</span>
          <span className="px-1 py-1">Today's Deals</span>
          <span className="px-1 py-1">Coupons</span>
          <span className="px-1 py-1">Flights</span>
          <span className="px-1 py-1">Fresh</span>
          <span className="px-1 py-1">Grocery &amp; Gourmet Foods</span>
          <span className="px-1 py-1">Electronics</span>
          <span className="px-1 py-1">New Releases</span>
        </div>
        <div className="hidden xl:flex shrink-0 items-center gap-2 whitespace-nowrap text-[12px] font-bold">
          <span className="rounded bg-[#17618b] px-3 py-1 text-[#ffd814]">✈ IMPOSSIBLE TRAVEL DEALS</span>
          <span>Up to 30% off* on flights</span>
          <span className="rounded-full bg-[#ffd814] px-2 py-1 text-[#131921]">pay</span>
        </div>
      </nav>

      {/* 2. Mobile Header Bar (md:hidden) */}
      <div className="md:hidden flex flex-col bg-[#131921]">
        {/* Top Mobile Row: Hamburger + Amazon Logo + User + Cart */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white hover:bg-slate-800 rounded transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center"
              aria-label="Amazon Home"
            >
              <AmazonLogo variant="white" className="h-7 w-auto" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-white">
            <button
              onClick={() => {} }
              className="flex items-center gap-1 text-xs py-1 px-1.5 rounded hover:bg-slate-800"
            >
              <User className="w-5 h-5 text-gray-200" />
              <span className="text-[12px] font-medium max-w-[85px] truncate">
                Customer
              </span>
            </button>

            <button
              onClick={() => onNavigate('cart')}
              className="relative p-1 text-white hover:bg-slate-800 rounded"
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-[#f08804] text-black font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Row 2: Full Width Mobile Search Bar with Live Autocomplete */}
        <div ref={mobileSearchRef} className="px-3 pb-2 relative">
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full shadow-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (suggestions.length === 0) setSuggestions(POPULAR_SEARCHES);
                setShowSuggestions(true);
              }}
              placeholder="Search Amazon.in"
              className="w-full py-2 px-3 text-sm text-gray-900 bg-white rounded-l-md focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 px-4 py-2 rounded-r-md shrink-0 flex items-center justify-center transition"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-gray-900" />
            </button>
          </form>

          {/* Mobile Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-3 right-3 mt-1 bg-white text-gray-900 rounded-md shadow-2xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100">
              {suggestions.map((sug, i) => (
                <div
                  key={i}
                  onClick={() => handleSuggestionClick(sug)}
                  className="px-4 py-2.5 text-xs hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium text-gray-800">{sug}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Search</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Row 3: Deliver to Strip */}
        <button
          onClick={onOpenPincodeModal}
          className="flex items-center gap-2 px-3 py-2 bg-[#232f3e] text-left text-xs text-white border-t border-slate-700/60"
        >
          <MapPin className="w-4 h-4 text-white shrink-0" />
          <span className="text-[12px] truncate">
            Delivering to {deliveryInfo ? `${deliveryInfo.zoneName.split(' ')[0]} ${deliveryPincode}` : `Pratapgarh ${deliveryPincode}`} - <span className="text-[#febd69] font-bold">Update location</span>
          </span>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-amazon-blue border-t border-slate-700 px-4 py-3 space-y-2 text-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700">
            <span className="text-gray-300">Deliver to: {deliveryPincode}</span>
            <button onClick={onOpenPincodeModal} className="text-amazon-yellow text-xs font-bold underline">
              Change PIN
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('home'); }}
              className="text-left py-2 px-3 bg-slate-800 rounded hover:bg-slate-700"
            >
              Home
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('listing'); }}
              className="text-left py-2 px-3 bg-slate-800 rounded hover:bg-slate-700"
            >
              All Deals
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('cart'); }}
              className="text-left py-2 px-3 bg-slate-800 rounded hover:bg-slate-700 flex justify-between"
            >
              <span>Cart</span>
              <span className="bg-amazon-yellow text-black font-bold px-1.5 py-0.2 rounded-full text-xs">
                {totalItems}
              </span>
            </button>
            <button
              onClick={() => {} }
              className="text-left py-2 px-3 bg-slate-800 rounded hover:bg-slate-700"
            >
              Wishlist ({wishlistCount})
            </button>
            <button
              onClick={() => {} }
              className="text-left py-2 px-3 bg-slate-800 rounded hover:bg-slate-700"
            >
              Track Order
            </button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigate('admin'); }} className={`text-left py-2 px-3 font-bold text-white rounded ${isAdmin ? 'bg-amber-600 hover:bg-amber-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
              {isAdmin ? 'Admin Panel' : 'Admin Login'}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
            <button
              onClick={() => {} }
              className="w-full bg-[#37475a] text-white font-bold py-2 rounded text-center text-xs flex items-center justify-center gap-1.5"
            >
              <Package className="w-4 h-4 text-amazon-yellow" />
              <span>Track Orders & Account</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
