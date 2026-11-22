import React from 'react';
import { resolveMediaUrl } from '../services/api';
import { Star, Heart, ShoppingCart, Zap, Check, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import AmazonPrimeBadge from './AmazonPrimeBadge';

export default function ProductCard({ product, onNavigate, imagePriority = false }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const primaryImg = product.images?.[0]?.imageUrl || product.primaryImageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600';
  const discount = product.discountPercent || (product.mrp && product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0);
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    onNavigate('checkout', { directBuyProduct: product });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={() => onNavigate('product-detail', { productId: product.id, slug: product.slug })}
      className="bg-white rounded-lg p-2 sm:p-3.5 border border-gray-200 hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer group relative min-w-0"
    >
      {/* Top Badges: Discount & Wishlist */}
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        {discount > 0 ? (
          <span className="bg-amazon-dealRed text-white text-[9px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded uppercase">
            {discount}% OFF
          </span>
        ) : (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Top Rated
          </span>
        )}

        <button
          onClick={handleToggleWishlist}
          className={`p-1.5 rounded-full transition ${
            inWishlist ? 'text-rose-600 bg-rose-50' : 'text-gray-400 hover:text-rose-600 hover:bg-gray-100'
          }`}
          title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image */}
      <div className="w-full h-40 sm:h-48 flex items-center justify-center overflow-hidden mb-2 sm:mb-3 p-1 sm:p-2 bg-white">
        <img
          src={resolveMediaUrl(primaryImg)}
          alt={product.title}
          width="400"
          height="400"
          decoding="async"
          fetchpriority={imagePriority ? 'high' : 'auto'}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="eager"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col">
        {/* Brand */}
        <div className="text-[9px] sm:text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">
          {product.brand?.name || 'Brand'}
        </div>

        {/* Title */}
        <h3 className="text-[11px] sm:text-sm font-medium text-gray-900 line-clamp-2 hover:text-amazon-link transition mb-1 leading-snug min-h-[2rem] sm:min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Ratings */}
        <div className="flex items-center gap-1 mb-1.5 sm:mb-2 min-w-0">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                  i < Math.floor(product.rating || 4.5)
                    ? 'fill-current text-amber-500'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs text-amazon-link font-semibold">
            {product.rating || 4.5}
          </span>
          <span className="text-[9px] sm:text-[11px] text-gray-500 truncate">
            ({(product.reviewCount || 120).toLocaleString()})
          </span>
        </div>

        {/* Price Block */}
        <div className="mb-2">
          {discount > 10 && (
            <div className="flex items-center gap-1.5 mb-1">
              <span className="bg-[#cc0c39] text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm">
                {discount}% off
              </span>
              <span className="text-[11px] font-bold text-[#cc0c39]">Limited time deal</span>
            </div>
          )}
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-gray-700 font-normal">₹</span>
            <span className="text-base sm:text-xl font-bold text-[#0f1111] tracking-tight">
              {Math.round(product.price).toLocaleString('en-IN')}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                M.R.P: ₹{Math.round(product.mrp).toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {product.mrp && product.mrp > product.price && (
            <div className="text-[11px] text-[#007600] font-medium">
              Save ₹{Math.round(product.mrp - product.price).toLocaleString('en-IN')} ({discount}%)
            </div>
          )}
        </div>

        {/* Delivery & Prime Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-700 mb-2 flex-wrap">
          <AmazonPrimeBadge />
          <span><b>FREE Delivery</b> by <b>Tomorrow</b></span>
        </div>

        {/* Stock Status */}
        <div className="mb-2 sm:mb-3 text-[10px] sm:text-[11px]">
          {product.stockQuantity > 0 ? (
            isLowStock ? (
              <span className="text-red-700 font-bold">Only {product.stockQuantity} left in stock - order soon.</span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> In Stock
              </span>
            )
          ) : (
            <span className="text-rose-600 font-bold">Currently Unavailable</span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
        <button
          onClick={handleAddToCart}
          disabled={!product.stockQuantity || product.stockQuantity < 1}
          className="w-full bg-amazon-gold hover:bg-amazon-goldHover text-gray-950 font-bold py-1.5 px-1 sm:px-3 rounded-full text-[10px] sm:text-xs transition shadow-sm flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Add to Cart</span>
        </button>

        <button
          onClick={handleBuyNow}
          disabled={!product.stockQuantity || product.stockQuantity < 1}
          className="w-full bg-amazon-buyNow hover:bg-amazon-buyNowHover text-gray-950 font-bold py-1.5 px-1 sm:px-3 rounded-full text-[10px] sm:text-xs transition shadow-sm flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
