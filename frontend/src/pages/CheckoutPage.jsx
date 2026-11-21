import React, { useState, useEffect } from 'react';
import { resolveMediaUrl } from '../services/api';
import {
  ShieldCheck, MapPin, Truck, CreditCard, Smartphone, Check,
  Building, Banknote, ArrowRight, Lock, AlertCircle, Sparkles,
  ShoppingBag, ChevronDown, Edit3
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi, userApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import UpiQrModal from '../components/UpiQrModal';
import AmazonLogo from '../components/AmazonLogo';

export default function CheckoutPage({ directBuyProduct, onNavigate }) {
  const { items: cartItems, subtotal: cartSubtotal, finalTotal: cartFinalTotal, discountAmount: cartDiscount, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { success, error, warning } = useToast();

  // If directly buying a single product (Buy Now flow)
  const items = directBuyProduct
    ? [{ product: directBuyProduct, quantity: 1, unitPrice: directBuyProduct.price }]
    : (cartItems.length > 0 ? cartItems : (directBuyProduct ? [{ product: directBuyProduct, quantity: 1, unitPrice: directBuyProduct.price }] : []));

  const subtotal = directBuyProduct ? directBuyProduct.price : cartSubtotal;
  const isFreeDelivery = subtotal >= 499;

  // Address State (Pre-filled so customer can proceed straight to payment without obstacles)
  const [fullName, setFullName] = useState(user?.fullName || 'Customer');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [email, setEmail] = useState(user?.email || 'customer@amazon.com');
  const [addressLine1, setAddressLine1] = useState('Flat 402, Sunshine Heights, Central Road');
  const [addressLine2, setAddressLine2] = useState('Near Metro Station');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('400072');
  const [showAddressEdit, setShowAddressEdit] = useState(false);

  // Delivery Speed
  const [expressDelivery, setExpressDelivery] = useState(false);

  // Payment Method - Active & Front-Center
  const [paymentMethod] = useState('UPI_QR'); // Direct UPI QR only

  // Card details

  // Order Placement & QR Modal
  const [placingOrder, setPlacingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [upiModalOpen, setUpiModalOpen] = useState(false);

  const shippingFee = expressDelivery ? 99 : (isFreeDelivery ? 0 : 40);
  const discountAmount = directBuyProduct ? 0 : cartDiscount;
  const finalPayable = Math.max(0, subtotal - discountAmount + shippingFee);

  const handlePlaceOrder = async () => {
    if (!fullName || !phone || !email || !addressLine1 || !city || !postalCode) {
      error('Please provide recipient name, mobile number, and address');
      setShowAddressEdit(true);
      return;
    }

    if (items.length === 0) {
      error('No items found in cart. Please select a product to buy.');
      onNavigate('home');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderPayload = {
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        paymentMethod,
        expressDelivery,
        couponCode: appliedCoupon?.code || undefined,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity || 1
        }))
      };

      const res = await orderApi.checkout(orderPayload);
      const newOrder = res.data;
      setCreatedOrder(newOrder);

      // Direct Payment Action:
      if (paymentMethod === 'UPI_QR') {
        // Launches genuine scannable dynamic UPI QR code immediately
        setUpiModalOpen(true);
      } else { throw new Error('Only Direct UPI QR payment is enabled.'); }
    } catch (err) {
      error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleUpiSuccess = (paymentData) => {
    setUpiModalOpen(false);
    if (!directBuyProduct) clearCart();
    onNavigate('order-success', { order: createdOrder, payment: paymentData });
  };

  return (
    <div className="bg-[#eaeded] min-h-screen pb-16">
      {/* Checkout Header */}
      <header className="bg-amazon-navy text-white py-3.5 px-6 shadow-md border-b border-slate-800">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-1.5" aria-label="Amazon Home">
            <AmazonLogo variant="white" className="h-7 w-auto" />
            <span className="text-xs text-amber-400 font-bold ml-1.5 border-l border-gray-600 pl-2">
              Express Payment Checkout
            </span>
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">100% Secure 256-Bit SSL Encrypted Payment</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1200px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Payment & Delivery (8 cols) */}
        <div className="lg:col-span-8 space-y-5">

          {/* 1. PAYMENT METHOD - DIRECT & PROMINENT */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border-2 border-amazon-orange shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-amazon-orange text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  ⚡
                </span>
                <div>
                  <h2 className="font-bold text-base text-gray-900">Pay directly using UPI QR</h2>
                  <p className="text-xs text-gray-500">Choose your preferred payment mode to complete purchase</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                UPI QR Payment
              </span>
            </div>

            <div className="space-y-3">
              {/* Option 1: Dynamic UPI QR Code (Primary / Default) */}
              <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition ${
                paymentMethod === 'UPI_QR' ? 'border-amazon-orange bg-amber-50/60 ring-2 ring-amazon-orange/40' : 'hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="paymentOpt"
                  checked={paymentMethod === 'UPI_QR'}
                  readOnly
                  className="accent-amazon-yellow mt-1 w-4 h-4"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>Dynamic UPI QR Code (GPay, PhonePe, Paytm, BHIM, CRED)</span>
                    </span>
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wide">
                      RECOMMENDED
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5">
                    Generates a real scannable UPI QR code for the exact payable amount (<b>₹{Math.round(finalPayable).toLocaleString('en-IN')}</b>). Scan with any UPI app on your phone to pay instantly!
                  </p>
                  {paymentMethod === 'UPI_QR' && (
                    <div className="mt-3 p-3 bg-white border border-amber-200 rounded-lg flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center shrink-0 font-black text-xs">
                        UPI
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-gray-800">Merchant UPI ID: <span className="text-amazon-link font-mono">Your configured merchant UPI ID</span></div>
                        <div className="text-gray-500 text-[11px]">Payment stays Pending until merchant confirmation</div>
                      </div>
                    </div>
                  )}
                </div>
              </label>

            </div>
          </div>

          {/* 2. DELIVERY ADDRESS & RECIPIENT */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amazon-orange" />
                <h3 className="font-bold text-sm text-gray-900">Delivery Address</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressEdit(!showAddressEdit)}
                className="text-xs text-amazon-link hover:underline font-semibold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{showAddressEdit ? 'Save / Close' : 'Change Address'}</span>
              </button>
            </div>

            {!showAddressEdit ? (
              <div className="bg-gray-50 p-3.5 rounded-lg text-xs text-gray-800 space-y-1">
                <div className="font-bold text-sm text-gray-900">{fullName} <span className="text-gray-500 font-normal">({phone})</span></div>
                <div>{addressLine1}{addressLine2 ? `, ${addressLine2}` : ''}</div>
                <div>{city}, {state} - <b>{postalCode}</b></div>
                <div className="text-[11px] text-emerald-700 font-semibold pt-1">
                  ✓ Dispatch Warehouse: Mumbai Central Hub (PIN: 400072)
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2 text-xs animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-xs"
                      placeholder="Recipient full name"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-xs"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Flat, House no., Building, Company, Apartment</label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-xs"
                    placeholder="Street Address"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressEdit(false)}
                    className="bg-amazon-yellow font-bold text-gray-950 px-4 py-1.5 rounded-md text-xs shadow-xs"
                  >
                    Confirm Address
                  </button>
                </div>
              </div>
            )}

            {/* Delivery Speed Selector */}
            <div className="mt-4 pt-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-start gap-2.5 p-3 border rounded-lg cursor-pointer ${
                !expressDelivery ? 'border-amazon-orange bg-amber-50/40 ring-1 ring-amazon-orange' : 'hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="speed"
                  checked={!expressDelivery}
                  onChange={() => setExpressDelivery(false)}
                  className="accent-amazon-yellow mt-0.5"
                />
                <div className="text-xs">
                  <div className="font-bold text-gray-900">Standard Delivery ({isFreeDelivery ? 'FREE' : '₹40'})</div>
                  <div className="text-emerald-700 text-[11px] font-semibold">Estimated in 2-3 business days</div>
                </div>
              </label>

              <label className={`flex items-start gap-2.5 p-3 border rounded-lg cursor-pointer ${
                expressDelivery ? 'border-amazon-orange bg-amber-50/40 ring-1 ring-amazon-orange' : 'hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="speed"
                  checked={expressDelivery}
                  onChange={() => setExpressDelivery(true)}
                  className="accent-amazon-yellow mt-0.5"
                />
                <div className="text-xs">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5">
                    <span>Express Priority Delivery (₹99)</span>
                    <span className="bg-amber-100 text-amber-900 font-bold px-1 py-0.2 rounded text-[10px]">FAST</span>
                  </div>
                  <div className="text-amazon-orange text-[11px] font-semibold">Priority dispatch within 24 hours</div>
                </div>
              </label>
            </div>
          </div>

          {/* 3. ORDER ITEMS PREVIEW */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h3 className="font-bold text-sm text-gray-900 pb-2 border-b mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-gray-700" />
              <span>Review Items in This Order ({items.length})</span>
            </h3>

            <div className="divide-y divide-gray-100">
              {items.map(({ product, quantity, unitPrice }) => (
                <div key={product.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white border rounded p-1 flex items-center justify-center shrink-0">
                      <img
                        src={resolveMediaUrl(product.images?.[0]?.imageUrl || product.primaryImageUrl)}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 line-clamp-1">{product.title}</h4>
                      <div className="text-gray-500 text-[11px]">Qty: {quantity || 1} • Unit Price: ₹{Math.round(unitPrice).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  <span className="font-bold text-gray-950 shrink-0 text-sm">
                    ₹{Math.round(unitPrice * (quantity || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Order Summary & Instant Pay Button (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4 sticky top-20">
            <h3 className="font-bold text-sm text-gray-900 pb-2 border-b">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-medium">₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount:</span>
                  <span>-₹{Math.round(discountAmount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="font-semibold">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingFee}`}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t flex items-baseline justify-between">
              <span className="text-base font-bold text-gray-900">Total Payable:</span>
              <span className="text-2xl font-black text-amazon-dealRed">
                ₹{Math.round(finalPayable).toLocaleString('en-IN')}
              </span>
            </div>

            {/* INSTANT PAY NOW BUTTON */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-gray-950 font-bold py-3.5 px-6 rounded-full text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 border border-[#fcd200]"
            >
              <Lock className="w-4 h-4" />
              <span>
                {placingOrder ? 'Creating Order...' : `Pay ₹${Math.round(finalPayable).toLocaleString('en-IN')} via UPI QR`}
              </span>
            </button>

            <div className="p-3 bg-gray-50 rounded-lg text-[11px] text-gray-500 leading-tight space-y-1">
              <div className="flex items-center gap-1 font-semibold text-gray-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Amazon Safe & Secure Guarantee</span>
              </div>
              <p>No login or registration required. Your payment and address details are processed securely through bank-level encryption.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Dynamic UPI QR Modal */}
      <UpiQrModal
        isOpen={upiModalOpen}
        onClose={() => setUpiModalOpen(false)}
        order={createdOrder}
        onPaymentSuccess={handleUpiSuccess}
      />
    </div>
  );
}
