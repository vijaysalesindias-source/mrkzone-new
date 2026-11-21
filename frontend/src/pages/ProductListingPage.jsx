import React, { useState, useEffect } from 'react';
import {
  Filter, X, Star, ChevronDown, Check, ArrowUpDown, SlidersHorizontal, RefreshCw
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productApi, metaApi } from '../services/api';

export default function ProductListingPage({ queryParams = {}, onNavigate }) {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(queryParams.categoryId || '');
  const [selectedBrand, setSelectedBrand] = useState(queryParams.brandId || '');
  const [minPrice, setMinPrice] = useState(queryParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(queryParams.maxPrice || '');
  const [minRating, setMinRating] = useState(queryParams.minRating || '');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category slug if passed
  useEffect(() => {
    metaApi.getCategories().then(res => {
      const cats = res.data || [];
      setCategories(cats);
      if (queryParams.categorySlug) {
        const found = cats.find(c => c.slug === queryParams.categorySlug);
        if (found) setSelectedCategory(found.id);
      }
    }).catch(() => {});

    metaApi.getBrands().then(res => {
      const brs = res.data || [];
      setBrands(brs);
      if (queryParams.brandSlug) {
        const found = brs.find(b => b.slug === queryParams.brandSlug);
        if (found) setSelectedBrand(found.id);
      }
    }).catch(() => {});
  }, [queryParams]);

  // Load products based on query params & filters
  const loadProducts = () => {
    setLoading(true);
    const params = {
      keyword: queryParams.keyword || undefined,
      categoryId: selectedCategory || undefined,
      brandId: selectedBrand || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      inStockOnly: inStockOnly || undefined,
      sortBy,
      page: currentPage,
      size: 16
    };

    productApi.getProducts(params)
      .then(res => {
        const pageData = res.data;
        if (pageData) {
          setProducts(pageData.content || []);
          setTotalCount(pageData.totalElements || 0);
          setTotalPages(pageData.totalPages || 1);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, [queryParams.keyword, selectedCategory, selectedBrand, minPrice, maxPrice, minRating, inStockOnly, sortBy, currentPage]);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setInStockOnly(false);
    setSortBy('relevance');
    setCurrentPage(0);
  };

  const hasActiveFilters = Boolean(selectedCategory || selectedBrand || minPrice || maxPrice || minRating || inStockOnly);

  return (
    <div className="bg-[#eaeded] min-h-screen pb-16">
      {/* Top Results Bar */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-gray-500">
              Showing 1-{products.length} of {totalCount} results
            </span>
            {queryParams.keyword && (
              <span className="font-bold text-gray-900 ml-1">
                for <span className="text-amazon-orange">"{queryParams.keyword}"</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(0);
                }}
                className="border border-gray-300 rounded-md py-1.5 px-2.5 bg-gray-50 text-gray-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amazon-yellow"
              >
                <option value="relevance">Featured & Relevant</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1500px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Filters Sidebar (3 cols) */}
        <aside className={`lg:col-span-3 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-6 ${
          mobileFilterOpen ? 'block' : 'hidden lg:block'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-amazon-yellow" />
              <span>Filters</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-amazon-link hover:underline font-semibold"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Department / Category Filter */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
              Category
            </h4>
            <div className="space-y-1.5 text-xs text-gray-700">
              <button
                onClick={() => { setSelectedCategory(''); setCurrentPage(0); }}
                className={`w-full text-left py-1 px-2 rounded font-medium flex items-center justify-between ${
                  !selectedCategory ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-gray-50'
                }`}
              >
                <span>All Categories</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setCurrentPage(0); }}
                  className={`w-full text-left py-1 px-2 rounded font-medium flex items-center justify-between ${
                    selectedCategory === cat.id ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Reviews Rating Filter */}
          <div className="pt-4 border-t">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
              Customer Reviews
            </h4>
            <div className="space-y-2 text-xs">
              {[4, 3, 2].map((r) => (
                <button
                  key={r}
                  onClick={() => { setMinRating(minRating === r ? '' : r); setCurrentPage(0); }}
                  className={`w-full flex items-center gap-1.5 py-1 px-1.5 rounded transition ${
                    minRating === r ? 'bg-amber-100 font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-gray-700">& Up</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="pt-4 border-t">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
              Brand
            </h4>
            <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto thin-scrollbar">
              {brands.map((b) => (
                <label key={b.id} className="flex items-center gap-2 cursor-pointer hover:text-gray-900 py-0.5">
                  <input
                    type="radio"
                    name="brandRadio"
                    checked={selectedBrand === b.id}
                    onChange={() => {
                      setSelectedBrand(selectedBrand === b.id ? '' : b.id);
                      setCurrentPage(0);
                    }}
                    className="accent-amazon-yellow"
                  />
                  <span>{b.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
              Price (₹)
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 border border-gray-300 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amazon-yellow"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 border border-gray-300 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amazon-yellow"
              />
            </div>
            <button
              onClick={() => setCurrentPage(0)}
              className="mt-2 w-full py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-xs font-bold border border-gray-300"
            >
              Apply Price
            </button>
          </div>

          {/* Availability */}
          <div className="pt-4 border-t">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => { setInStockOnly(e.target.checked); setCurrentPage(0); }}
                className="accent-amazon-yellow"
              />
              <span>Include In-Stock Only</span>
            </label>
          </div>
        </aside>

        {/* RIGHT COLUMN: Product Grid & Pagination (9 cols) */}
        <main className="lg:col-span-9">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-amazon-yellow border-t-amazon-navy rounded-full animate-spin" />
              <span className="text-xs font-medium text-gray-600">Loading marketplace inventory...</span>
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-6">
              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
                ))}
              </div>

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold bg-white hover:bg-gray-50 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                        idx === currentPage ? 'bg-amazon-navy text-white shadow' : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold bg-white hover:bg-gray-50 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">No matching products found</h3>
              <p className="text-xs text-gray-500 mb-6">
                Try adjusting your search criteria, removing filters, or searching for other items.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold px-6 py-2.5 rounded-full text-xs transition"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
