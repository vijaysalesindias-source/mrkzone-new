import React, { useState, useEffect } from 'react';
import { resolveMediaUrl } from '../services/api';
import {
  Star, Heart, ShoppingCart, Zap, Truck, ShieldCheck, RotateCcw,
  Check, AlertCircle, Share2, MapPin, ChevronRight, Play, CheckCircle,
  ThumbsUp, Percent
} from 'lucide-react';
import { productApi, metaApi, reviewApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import WriteReviewModal from '../components/WriteReviewModal';
import ProductCarousel from '../components/ProductCarousel';
import AmazonPrimeBadge from '../components/AmazonPrimeBadge';

export default function ProductDetailPage({ productId, onNavigate }) {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'video' | 'reviews'
  const [reviews, setReviews] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [bundleProducts, setBundleProducts] = useState([]);
  const [bundleSelected, setBundleSelected] = useState(true);
  const [loading, setLoading] = useState(true);

  // Delivery checker state
  const { deliveryPincode, setDeliveryPincode, addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error, info } = useToast();

  const [inputPincode, setInputPincode] = useState(deliveryPincode || '400072');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    if (!productId) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);

    productApi.getProductById(productId)
      .then(res => {
        const prod = res.data;
        setProduct(prod);
        setSelectedImage(0);

        // Fetch similar products with automatic fallback so similar items always display
        if (prod.category?.id) {
          productApi.getSimilar(prod.id, prod.category.id)
            .then(simRes => {
              const list = simRes.data || [];
              if (list.length >= 4) {
                setSimilarProducts(list);
              } else {
                productApi.getBestSellers()
                  .then(bsRes => {
                    const fallback = (bsRes.data || []).filter(p => p.id !== prod.id);
                    const merged = [...list, ...fallback.filter(f => !list.some(l => l.id === f.id))];
                    setSimilarProducts(merged.slice(0, 8));
                  })
                  .catch(() => setSimilarProducts(list));
              }
            })
            .catch(() => {
              productApi.getBestSellers()
                .then(bsRes => setSimilarProducts((bsRes.data || []).filter(p => p.id !== prod.id).slice(0, 8)))
                .catch(() => {});
            });
        }

        // Fetch reviews
        reviewApi.getProductReviews(prod.id)
          .then(revRes => setReviews(revRes.data || []))
          .catch(() => {});

        // Fetch frequently bought together
        productApi.getFrequentlyBoughtTogether()
          .then(bRes => {
            const others = (bRes.data || []).filter(p => p.id !== prod.id);
            if (others.length > 0) {
              setBundleProducts([others[0]]);
            }
          })
          .catch(() => {});

        setLoading(false);
      })
      .catch(err => {
        error(err.message || 'Product not found');
        setLoading(false);
      });
  }, [productId]);

  // Initial pincode check
  useEffect(() => {
    if (deliveryPincode) {
      metaApi.checkDelivery(deliveryPincode, product?.price || 1000)
        .then(res => setPincodeResult(res.data))
        .catch(() => {});
    }
  }, [deliveryPincode, product]);

  const handlePincodeCheck = async (e) => {
    e.preventDefault();
    if (!inputPincode || inputPincode.trim().length !== 6) {
      error('Enter a valid 6-digit PIN code');
      return;
    }
    setPincodeLoading(true);
    try {
      const res = await metaApi.checkDelivery(inputPincode.trim(), product?.price || 1000);
      setPincodeResult(res.data);
      if (res.data?.serviceable) {
        setDeliveryPincode(inputPincode.trim());
        localStorage.setItem('mrkzone_pincode', inputPincode.trim());
        success(`Delivery available to ${res.data.zoneName}`);
      }
    } catch (err) {
      error(err.message || 'Error checking pincode');
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    onNavigate('checkout', { directBuyProduct: product });
  };

  const handleAddBundleToCart = () => {
    if (!product) return;
    addToCart(product, 1);
    if (bundleProducts.length > 0 && bundleSelected) {
      addToCart(bundleProducts[0], 1);
    }
    success('Added Frequently Bought Together bundle to cart!');
  };

  const handleHelpfulReview = (reviewId) => {
    reviewApi.markHelpful(reviewId)
      .then(res => {
        setReviews(prev => prev.map(r => r.id === reviewId ? res.data : r));
        info('Marked review as helpful');
      })
      .catch(() => {});
  };

  if (loading) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amazon-yellow border-t-amazon-navy rounded-full animate-spin" />
          <span className="text-sm font-medium text-gray-600">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <button
          onClick={() => onNavigate('home')}
          className="bg-amazon-yellow font-bold text-xs px-6 py-2.5 rounded-full"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images.map(img => img.imageUrl)
    : [product.primaryImageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'];

  const discount = product.discountPercent || (product.mrp && product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0);
  const savings = product.mrp ? Math.max(0, product.mrp - product.price) : 0;
  const inWishlist = isInWishlist(product.id);

  let specs = {};
  try {
    if (product.specsJson) {
      specs = JSON.parse(product.specsJson);
    }
  } catch (e) {
    specs = { "Brand": product.brand?.name, "Model": product.modelNumber, "SKU": product.sku };
  }

  const bundleItem = bundleProducts[0];
  const bundleTotalPrice = product.price + (bundleItem && bundleSelected ? bundleItem.price : 0);

  return (
    <div className="bg-[#eaeded] min-h-screen pb-28 lg:pb-16">
      {/* Breadcrumb Navigation */}
      <div className="max-w-[1500px] mx-auto px-4 py-2.5 text-xs text-gray-500 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        <button onClick={() => onNavigate('home')} className="hover:underline">Home</button>
        <ChevronRight className="w-3 h-3" />
        <button
          onClick={() => onNavigate('listing', { categorySlug: product.category?.slug })}
          className="hover:underline"
        >
          {product.category?.name || 'Category'}
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.title}</span>
      </div>

      <div className="max-w-[1500px] mx-auto px-4">
        {/* Main Product Container */}
        <div className="bg-white rounded-xl p-4 sm:p-8 border border-gray-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Gallery & Zoomable Image (5 cols) */}
          <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnail Strip */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto no-scrollbar shrink-0 sm:max-h-[460px]">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-md p-1 border-2 transition flex items-center justify-center bg-white shrink-0 ${
                    selectedImage === idx ? 'border-amazon-orange shadow' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={resolveMediaUrl(imgUrl)} alt={`Thumbnail ${idx}`} className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>

            {/* Main Interactive Zoom Canvas */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-center relative min-h-[360px] sm:min-h-[460px] zoom-container overflow-hidden group">
              <img
                src={resolveMediaUrl(images[selectedImage] || images[0])}
                alt={product.title}
                className="max-h-[420px] max-w-full object-contain zoom-image"
              />

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition ${
                  inWishlist ? 'bg-rose-50 text-rose-600' : 'bg-white text-gray-400 hover:text-rose-600'
                }`}
                title={inWishlist ? "In Wishlist" : "Add to Wishlist"}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>

              <span className="absolute bottom-2 left-2 text-[10px] text-gray-400 font-medium bg-white/80 px-2 py-0.5 rounded pointer-events-none">
                Hover to zoom
              </span>
            </div>
          </div>

          {/* MIDDLE COLUMN: Product Details & Specs (4 cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            {/* Brand Link */}
            <div>
              <button
                onClick={() => onNavigate('listing', { brandSlug: product.brand?.slug })}
                className="text-xs text-amazon-link hover:text-amazon-linkHover font-bold uppercase tracking-wider"
              >
                Brand: {product.brand?.name || 'Amazon Basics'}
              </button>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 leading-snug">
                {product.title}
              </h1>
              <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
                <span>SKU: {product.sku}</span>
                {product.modelNumber && <span>• Model: {product.modelNumber}</span>}
              </div>
            </div>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-2 pb-3 border-b">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 4.5) ? 'fill-current text-amber-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-amazon-link">{product.rating || 4.5}</span>
              <span className="text-xs text-gray-500">
                ({(product.reviewCount || 120).toLocaleString()} customer ratings)
              </span>
            </div>

            {/* Price & Savings */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-amazon-dealRed text-2xl font-light">-{discount}%</span>
                <span className="text-xs font-bold text-gray-700">₹</span>
                <span className="text-3xl font-black text-gray-950 tracking-tight">
                  {Math.round(product.price).toLocaleString('en-IN')}
                </span>
              </div>
              {product.mrp && product.mrp > product.price && (
                <div className="text-xs text-gray-500">
                  M.R.P.: <span className="line-through">₹{Math.round(product.mrp).toLocaleString('en-IN')}</span>
                  <span className="text-emerald-700 font-semibold ml-2">
                    You Save: ₹{Math.round(savings).toLocaleString('en-IN')} ({discount}%)
                  </span>
                </div>
              )}
              <div className="text-[11px] text-gray-500">Inclusive of all taxes</div>
            </div>

            {/* Promotional Offers Box */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-amber-700" />
                <span>Available Offers</span>
              </div>
              <ul className="space-y-1.5 text-gray-800 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded text-[10px] shrink-0 mt-0.5">BANK</span>
                  <span>Instant 10% discount on HDFC, ICICI, SBI Credit Cards up to ₹1,500.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded text-[10px] shrink-0 mt-0.5">UPI QR</span>
                  <span>Get flat ₹100 discount using coupon <b>AMAZON100</b> with Dynamic UPI QR payment.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-indigo-800 bg-indigo-100 px-1.5 py-0.2 rounded text-[10px] shrink-0 mt-0.5">NO COST EMI</span>
                  <span>Avail No Cost EMI on select cards for orders over ₹3,000.</span>
                </li>
              </ul>
            </div>

            {/* Warranty & Returns Badges Strip */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-center">
              <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                <RotateCcw className="w-5 h-5 text-amazon-link" />
                <span className="text-[11px] font-bold text-gray-800">{product.returnPolicy || '7 Days Replacement'}</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                <Truck className="w-5 h-5 text-amazon-link" />
                <span className="text-[11px] font-bold text-gray-800">Free Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-amazon-link" />
                <span className="text-[11px] font-bold text-gray-800">{product.warrantyPeriod || '1 Year Brand Warranty'}</span>
              </div>
            </div>

            {/* Short Highlights */}
            {product.shortDescription && (
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">About this item</h4>
                <p className="text-xs text-gray-700 leading-relaxed">{product.shortDescription}</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Buy Box & Delivery PIN Checker (3 cols) */}
          <div className="lg:col-span-3">
            <div className="border border-gray-300 rounded-xl p-5 bg-white shadow-sm space-y-4 sticky top-24">
              {/* Buy Box Price */}
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-gray-700">₹</span>
                  <span className="text-2xl font-black text-gray-900">
                    {Math.round(product.price).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-800 font-medium mt-1">
                  <AmazonPrimeBadge />
                  <span className="text-emerald-700 font-bold">FREE Delivery</span>
                </div>
              </div>

              {/* Delivery PIN Code Checker */}
              <div className="pt-2 border-t space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold">
                  <MapPin className="w-4 h-4 text-amazon-yellow fill-current" />
                  <span>Check Delivery to PIN code</span>
                </div>

                <form onSubmit={handlePincodeCheck} className="flex gap-1.5">
                  <input
                    type="text"
                    maxLength={6}
                    value={inputPincode}
                    onChange={(e) => setInputPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit PIN"
                    className="flex-1 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amazon-yellow"
                  />
                  <button
                    type="submit"
                    disabled={pincodeLoading}
                    className="bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-1.5 rounded text-xs font-bold transition"
                  >
                    {pincodeLoading ? '...' : 'Check'}
                  </button>
                </form>

                {pincodeResult && (
                  <div className={`p-2 rounded text-[11px] ${pincodeResult.serviceable ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900'}`}>
                    {pincodeResult.serviceable ? (
                      <div>
                        <div className="font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Delivery by {pincodeResult.formattedDeliveryDate}</span>
                        </div>
                        <div className="text-gray-600 text-[10px] mt-0.5">
                          Dispatched from Mumbai Central Hub (400072)
                        </div>
                      </div>
                    ) : (
                      <span>{pincodeResult.message}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div>
                {product.stockQuantity > 0 ? (
                  <div>
                    <span className="text-base font-bold text-emerald-700 block">In Stock</span>
                    {product.stockQuantity <= 5 && (
                      <span className="text-xs text-red-700 font-medium">Only {product.stockQuantity} left in stock - order soon.</span>
                    )}
                  </div>
                ) : (
                  <span className="text-base font-bold text-rose-600">Currently Unavailable</span>
                )}
              </div>

              {/* Seller Information */}
              <div className="text-xs text-gray-600 space-y-1 pt-2 border-t text-[11px]">
                <div className="flex justify-between">
                  <span>Ships from:</span>
                  <span className="font-semibold text-gray-900">Fulfilled by Amazon</span>
                </div>
                <div className="flex justify-between">
                  <span>Sold by:</span>
                  <span className="font-semibold text-amazon-link">{product.sellerName || 'Amazon Retail India'} ({product.sellerRating || 4.8}★)</span>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.stockQuantity > 0 && (
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-gray-700">Quantity:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amazon-yellow"
                  >
                    {[...Array(Math.min(10, product.stockQuantity))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.stockQuantity || product.stockQuantity < 1}
                  className="w-full bg-amazon-gold hover:bg-amazon-goldHover text-gray-950 font-bold py-2.5 px-4 rounded-full text-xs transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!product.stockQuantity || product.stockQuantity < 1}
                  className="w-full bg-amazon-buyNow hover:bg-amazon-buyNowHover text-gray-950 font-bold py-2.5 px-4 rounded-full text-xs transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Secure Transaction Guarantee */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 pt-2 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Secure 256-bit SSL transaction</span>
              </div>
            </div>
          </div>

        </div>

        {/* FREQUENTLY BOUGHT TOGETHER BUNDLE */}
        {bundleItem && (
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mt-8">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
              Frequently Bought Together
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-24 h-24 p-2 border rounded-lg flex items-center justify-center bg-white">
                  <img src={resolveMediaUrl(images[0])} alt={product.title} className="max-h-full max-w-full object-contain" />
                </div>
                <span className="text-xl font-bold text-gray-400">+</span>
                <div className="w-24 h-24 p-2 border rounded-lg flex items-center justify-center bg-white">
                  <img
                    src={resolveMediaUrl(bundleItem.images?.[0]?.imageUrl || bundleItem.primaryImageUrl)}
                    alt={bundleItem.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="ml-2 text-xs text-gray-700 space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input type="checkbox" checked disabled className="accent-amazon-yellow" />
                    <span><b>This item:</b> {product.title.slice(0, 45)}... (₹{Math.round(product.price).toLocaleString('en-IN')})</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={bundleSelected}
                      onChange={(e) => setBundleSelected(e.target.checked)}
                      className="accent-amazon-yellow"
                    />
                    <span>{bundleItem.title.slice(0, 45)}... (₹{Math.round(bundleItem.price).toLocaleString('en-IN')})</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">Total price:</span>
                  <span className="text-xl font-black text-gray-950">
                    ₹{Math.round(bundleTotalPrice).toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={handleAddBundleToCart}
                  className="bg-amazon-gold hover:bg-amazon-goldHover text-gray-950 font-bold px-6 py-2.5 rounded-full text-xs shadow-sm transition"
                >
                  Add both to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TABS: Specifications / Detailed Description / Video */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mt-8">
          <div className="flex gap-6 border-b border-gray-200 mb-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 transition border-b-2 ${
                activeTab === 'specs' ? 'border-amazon-orange text-amazon-orange' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 transition border-b-2 ${
                activeTab === 'desc' ? 'border-amazon-orange text-amazon-orange' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Detailed Overview
            </button>
            {product.videoUrl && (
              <button
                onClick={() => setActiveTab('video')}
                className={`pb-3 transition border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'video' ? 'border-amazon-orange text-amazon-orange' : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>Product Video</span>
              </button>
            )}
          </div>

          {/* TAB 1: Specs Table */}
          {activeTab === 'specs' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-gray-200 rounded-lg">
                <tbody>
                  <tr className="border-b bg-gray-50">
                    <td className="py-2.5 px-4 font-bold text-gray-700 w-1/3">Brand</td>
                    <td className="py-2.5 px-4 text-gray-900">{product.brand?.name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2.5 px-4 font-bold text-gray-700">Model Number / SKU</td>
                    <td className="py-2.5 px-4 text-gray-900">{product.modelNumber || product.sku}</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="py-2.5 px-4 font-bold text-gray-700">Category</td>
                    <td className="py-2.5 px-4 text-gray-900">{product.category?.name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2.5 px-4 font-bold text-gray-700">Warranty</td>
                    <td className="py-2.5 px-4 text-gray-900">{product.warrantyPeriod}</td>
                  </tr>
                  {Object.entries(specs).map(([key, val], idx) => (
                    <tr key={idx} className={`border-b ${idx % 2 === 0 ? 'bg-gray-50' : ''}`}>
                      <td className="py-2.5 px-4 font-bold text-gray-700">{key}</td>
                      <td className="py-2.5 px-4 text-gray-900">{String(val)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Description */}
          {activeTab === 'desc' && (
            <div className="prose text-xs text-gray-700 leading-relaxed space-y-3">
              <p>{product.description}</p>
              {product.shortDescription && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-bold text-sm text-gray-900 mb-1">Key Highlights</h4>
                  <p>{product.shortDescription}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Video */}
          {activeTab === 'video' && product.videoUrl && (
            <div className="aspect-video w-full max-w-3xl mx-auto rounded-lg overflow-hidden bg-black flex items-center justify-center">
              <iframe
                src={product.videoUrl}
                title="Product Video"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* CUSTOMER REVIEWS & RATINGS */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mt-8">
          <div className="flex flex-col md:flex-row items-start justify-between pb-6 border-b gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 4.5) ? 'fill-current text-amber-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-black text-gray-900">{product.rating || 4.5} out of 5</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Based on {(product.reviewCount || 120).toLocaleString()} global ratings</p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <h4 className="font-bold text-sm text-gray-900">Review this product</h4>
              <p className="text-xs text-gray-500">Share your thoughts with other customers</p>
              <button
                onClick={() => setReviewModalOpen(true)}
                className="mt-1 bg-white hover:bg-gray-50 border border-gray-300 shadow-sm text-gray-900 font-bold px-6 py-2 rounded-lg text-xs transition"
              >
                Write a Product Review
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="mt-6 space-y-6">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="border-b pb-6 last:border-b-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                      {rev.reviewerName?.charAt(0) || 'C'}
                    </div>
                    <span className="text-xs font-bold text-gray-900">{rev.reviewerName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Purchase
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-current text-amber-500' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-900">{rev.title}</span>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                    <button
                      onClick={() => handleHelpfulReview(rev.id)}
                      className="border border-gray-300 px-3 py-1 rounded text-[11px] font-medium hover:bg-gray-50 flex items-center gap-1 transition"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({rev.helpfulCount || 0})</span>
                    </button>
                    <span className="text-[11px]">Reviewed in India</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-xs">
                No customer reviews yet. Be the first to write a review!
              </div>
            )}
          </div>
        </div>

        {/* SIMILAR PRODUCTS RECOMMENDATIONS CAROUSEL */}
        {similarProducts.length > 0 && (
          <div className="mt-8">
            <ProductCarousel
              title="Customers who viewed this item also viewed (Similar Products)"
              subtitle="Similar and related top-rated recommendations"
              products={similarProducts}
              onNavigate={(page, params) => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavigate(page, params);
              }}
            />
          </div>
        )}

      </div>

      {/* Review Modal */}
      <WriteReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        product={product}
        onReviewSubmitted={(newRev) => setReviews([newRev, ...reviews])}
      />

      {/* Mobile Sticky Bottom Action Bar (lg:hidden) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-2.5 z-40 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 leading-tight">Total Price:</span>
          <span className="text-base font-black text-gray-950 leading-tight">
            ₹{Math.round(product.price).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <button
            onClick={handleAddToCart}
            disabled={!product.stockQuantity || product.stockQuantity < 1}
            className="flex-1 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-950 font-bold py-2.5 px-3 rounded-full text-xs transition shadow-sm flex items-center justify-center gap-1 disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={handleBuyNow}
            disabled={!product.stockQuantity || product.stockQuantity < 1}
            className="flex-1 bg-[#ffa41c] hover:bg-[#fa8900] text-gray-950 font-bold py-2.5 px-3 rounded-full text-xs transition shadow-sm flex items-center justify-center gap-1 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
