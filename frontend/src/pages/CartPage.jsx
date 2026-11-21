import React, { useState } from 'react';
import { resolveMediaUrl } from '../services/api';
import {
  Trash2, Heart, Plus, Minus, ShieldCheck, Tag, ArrowRight,
  Truck, CheckCircle, AlertTriangle, ShoppingBag, Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export default function CartPage({ onNavigate }) {
  const {
    items,
    totalItems,
    subtotal,
    originalTotal,
    totalSavings,
    discountAmount,
    shippingFee,
    isFreeDelivery,
    finalTotal,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { toggleWishlist } = useWishlist();
  const { success } = useToast();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponCodeInput.trim());
    setCouponLoading(false);
    setCouponCodeInput('');
  };

  const handleMoveToWishlist = (product) => {
    toggleWishlist(product);
    removeFromCart(product.id);
  };

  // Free shipping progress calculation
  const freeShippingThreshold = 499;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="bg-[#eaeded] min-h-screen py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-200 shadow-sm">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-800 mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your Amazon Cart is empty</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
            Your shopping cart is waiting for great finds! Explore today's best deals on smartphones, electronics, audio, and fashion with instant delivery.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold px-8 py-3 rounded-full text-xs transition shadow"
            >
              Start Shopping
            </button>
            <button
              onClick={() => onNavigate('listing', { deals: true })}
              className="bg-slate-900 hover:bg-black text-white font-bold px-8 py-3 rounded-full text-xs transition shadow"
            >
              View Today's Deals
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#eaeded] min-h-screen pb-16">
      <div className="max-w-[1500px] mx-auto px-4 py-6">

        {/* Free Shipping Progress Indicator */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1.5 font-bold">
              <Truck className="w-4 h-4 text-emerald-600" />
              {isFreeDelivery ? (
                <span className="text-emerald-700">Congratulations! Your order qualifies for <b>FREE Fast Delivery</b></span>
              ) : (
                <span className="text-gray-800">
                  Add items worth <b>₹{remainingForFreeShipping}</b> more to get <b>FREE Delivery</b>!
                </span>
              )}
            </div>
            <span className="font-bold text-gray-500">{freeShippingPercent}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isFreeDelivery ? 'bg-emerald-600' : 'bg-gradient-to-r from-amber-400 to-amazon-yellow'
              }`}
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: Cart Items (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">Shopping Cart</h1>
                <p className="text-xs text-gray-500 mt-0.5">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
              </div>
              <button
                onClick={clearCart}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                Deselect all items
              </button>
            </div>

            {/* Item List */}
            <div className="divide-y divide-gray-100">
              {items.map(({ product, quantity, unitPrice }) => (
                <div key={product.id} className="py-5 flex flex-col sm:flex-row gap-4 items-start justify-between">
                  {/* Thumbnail */}
                  <div
                    onClick={() => onNavigate('product-detail', { productId: product.id, slug: product.slug })}
                    className="w-24 h-24 sm:w-28 sm:h-28 bg-white border border-gray-200 rounded-lg p-2 flex items-center justify-center shrink-0 cursor-pointer hover:shadow-md transition"
                  >
                    <img
                      src={resolveMediaUrl(product.images?.[0]?.imageUrl || product.primaryImageUrl)}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-1">
                    <h3
                      onClick={() => onNavigate('product-detail', { productId: product.id, slug: product.slug })}
                      className="text-sm font-bold text-gray-900 hover:text-amazon-link cursor-pointer leading-snug line-clamp-2"
                    >
                      {product.title}
                    </h3>
                    <div className="text-[11px] text-gray-500">
                      Brand: <span className="font-semibold">{product.brand?.name}</span> • In Stock
                    </div>

                    <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Eligible for FREE Shipping</span>
                    </div>

                    {/* Quantity & Actions Bar */}
                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2.5 py-1 hover:bg-gray-200 text-gray-700 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 font-bold text-gray-900 bg-white border-x border-gray-300">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2.5 py-1 hover:bg-gray-200 text-gray-700 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="h-4 w-px bg-gray-300" />

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-amazon-link hover:underline font-medium flex items-center gap-1 text-[11px]"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-rose-600" />
                        <span>Delete</span>
                      </button>

                      <div className="h-4 w-px bg-gray-300" />

                      <button
                        onClick={() => handleMoveToWishlist(product)}
                        className="text-amazon-link hover:underline font-medium flex items-center gap-1 text-[11px]"
                      >
                        <Heart className="w-3.5 h-3.5 text-gray-400 hover:text-rose-600" />
                        <span>Save for later</span>
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right sm:pl-4 shrink-0">
                    <div className="text-lg font-black text-gray-950">
                      ₹{Math.round(unitPrice * quantity).toLocaleString('en-IN')}
                    </div>
                    {quantity > 1 && (
                      <div className="text-[11px] text-gray-500">
                        (₹{Math.round(unitPrice).toLocaleString('en-IN')} each)
                      </div>
                    )}
                    {product.mrp && product.mrp > product.price && (
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        Saved ₹{Math.round((product.mrp - product.price) * quantity).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal Footer */}
            <div className="pt-4 border-t flex justify-end text-sm">
              <span>
                Subtotal ({totalItems} items): <b className="text-lg font-black text-gray-950 ml-1">₹{Math.round(subtotal).toLocaleString('en-IN')}</b>
              </span>
            </div>
          </div>

          {/* RIGHT: Order Summary & Coupon (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Summary Box */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-gray-900 pb-2 border-b">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>Items Original Total:</span>
                  <span className="text-gray-500 line-through">₹{Math.round(originalTotal).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Cart Subtotal:</span>
                  <span>₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Product Discounts:</span>
                    <span>-₹{Math.round(totalSavings).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2 rounded">
                    <span>Coupon ({appliedCoupon.code}):</span>
                    <span>-₹{Math.round(discountAmount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping & Handling:</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Estimated GST (18% included):</span>
                  <span>₹{Math.round((subtotal - discountAmount) * 0.18).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-3 border-t flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold text-gray-900 block">Total Payable:</span>
                  <span className="text-[10px] text-gray-500">Includes all taxes & delivery</span>
                </div>
                <span className="text-2xl font-black text-amazon-dealRed tracking-tight">
                  ₹{Math.round(finalTotal).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold py-3 rounded-full text-xs transition shadow-sm flex items-center justify-center gap-2"
              >
                <span>Proceed to Buy ({totalItems} items)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Safe and Secure 256-bit SSL Checkout</span>
              </div>
            </div>

            {/* Apply Coupon Box */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900">
                <Tag className="w-4 h-4 text-amazon-orange" />
                <span>Coupons & Bank Offers</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                  <div>
                    <span className="font-bold text-emerald-800">{appliedCoupon.code} Applied</span>
                    <p className="text-[10px] text-emerald-700">{appliedCoupon.description}</p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amazon-yellow uppercase"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="bg-gray-100 hover:bg-gray-200 border border-gray-300 px-4 py-1.5 rounded text-xs font-bold transition disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Available Coupons list */}
              <div className="space-y-1.5 pt-2 text-[11px]">
                <div className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">
                  Available Coupons:
                </div>
                {[
                  { code: 'AMAZON100', desc: 'Flat ₹100 OFF on orders above ₹999' },
                  { code: 'SUPER500', desc: 'Flat ₹500 OFF on orders above ₹3,999' },
                  { code: 'WELCOME10', desc: '10% discount for first-time shoppers' },
                ].map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => applyCoupon(c.code)}
                    className="p-2 border border-dashed border-gray-300 rounded hover:border-amazon-yellow bg-gray-50 hover:bg-amber-50/50 cursor-pointer flex justify-between items-center transition"
                  >
                    <div>
                      <span className="font-bold text-gray-900 font-mono text-[11px]">{c.code}</span>
                      <p className="text-gray-500 text-[10px]">{c.desc}</p>
                    </div>
                    <span className="text-[10px] font-bold text-amazon-link">APPLY</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
