import React, { useState, useEffect } from 'react';
import {
  Package, Truck, CheckCircle2, Clock, XCircle, RotateCcw,
  Search, ShieldCheck, MapPin, AlertCircle, ArrowLeft
} from 'lucide-react';
import { orderApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function OrderTrackingPage({ orderNumber: initialOrderNumber, onNavigate }) {
  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderNumber || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found cheaper elsewhere');
  const [cancelling, setCancelling] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    if (initialOrderNumber) {
      handleLookup(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleLookup = async (orderNum) => {
    const num = orderNum || orderNumberInput.trim();
    if (!num) return;

    setLoading(true);
    try {
      const res = await orderApi.trackOrder(num);
      setOrder(res.data);
    } catch (err) {
      error(err.message || 'Order not found. Please verify the order number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const res = await orderApi.cancelOrder(order.orderNumber, cancelReason);
      setOrder(res.data);
      setCancelModalOpen(false);
      success('Order cancelled successfully.');
    } catch (err) {
      error(err.message || 'Cannot cancel this order');
    } finally {
      setCancelling(false);
    }
  };

  // Determine active step index
  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'CONFIRMED': return 1;
      case 'PROCESSING': return 2;
      case 'SHIPPED': return 3;
      case 'OUT_FOR_DELIVERY': return 4;
      case 'DELIVERED': return 5;
      case 'CANCELLED': return -1;
      case 'RETURN_REQUESTED': return 6;
      case 'RETURNED': return 7;
      case 'REFUNDED': return 8;
      default: return 1;
    }
  };

  const steps = [
    { label: 'Order Placed', desc: 'Order verified & recorded' },
    { label: 'Confirmed', desc: 'Payment approved' },
    { label: 'Processing', desc: 'Packed at Warehouse (Mumbai 400072)' },
    { label: 'Shipped', desc: 'Dispatched via Express Courier' },
    { label: 'Out for Delivery', desc: 'With local delivery agent' },
    { label: 'Delivered', desc: 'Delivered to your address' },
  ];

  const currentStepIdx = order ? getStepIndex(order.orderStatus) : 0;
  const isCancelled = order?.orderStatus === 'CANCELLED';

  return (
    <div className="bg-[#eaeded] min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Back Link */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-xs text-amazon-link hover:underline font-semibold mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping</span>
        </button>

        {/* Search Order Number Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Track Your Package</h1>
          <p className="text-xs text-gray-500 mb-4">
            Enter your Amazon order ID (e.g. <b>AMZ-2026-XXXXX</b> or <b>MRK-2026-XXXXX</b>) to check real-time fulfillment status.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); handleLookup(); }}
            className="flex gap-2 max-w-md"
          >
            <div className="relative flex-1">
              <Package className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value.toUpperCase())}
                placeholder="e.g. AMZ-2026-89124"
                className="w-full pl-9 pr-3.5 py-2 border border-gray-300 rounded-lg text-xs font-mono uppercase focus:ring-1 focus:ring-amazon-yellow focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold px-6 py-2 rounded-lg text-xs transition shadow-sm disabled:opacity-50 flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? 'Searching...' : 'Track'}</span>
            </button>
          </form>
        </div>

        {/* Tracking Details */}
        {order && (
          <div className="space-y-6 animate-fade-in">

            {/* Status Header Strip */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-500">Order</span>
                    <span className="text-base font-black text-gray-900 font-mono">#{order.orderNumber}</span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                      isCancelled ? 'bg-rose-100 text-rose-800' :
                      order.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-amber-100 text-amber-900'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Estimated Delivery: <b className="text-emerald-700">{order.estimatedDeliveryDate || '3 Business Days'}</b>
                  </div>
                </div>

                {/* Cancel Button if eligible */}
                {!isCancelled && currentStepIdx < 3 && (
                  <button
                    onClick={() => setCancelModalOpen(true)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold border border-rose-200 hover:bg-rose-50 px-3.5 py-1.5 rounded-lg transition"
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              {/* Courier info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block">Courier Partner</span>
                  <span className="font-bold text-gray-900">{order.courierName || 'Delhivery Express'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">AWB Tracking Number</span>
                  <span className="font-bold font-mono text-amazon-link">{order.trackingNumber || 'DELH8912839'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Fulfillment Origin</span>
                  <span className="font-bold text-gray-900">Mumbai Central Hub (400072)</span>
                </div>
              </div>

              {/* Visual Timeline Bar */}
              {!isCancelled ? (
                <div className="pt-6">
                  <div className="relative flex items-center justify-between w-full">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0" />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 z-0 transition-all duration-700"
                      style={{ width: `${Math.min(100, (Math.max(0, currentStepIdx) / (steps.length - 1)) * 100)}%` }}
                    />

                    {steps.map((st, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={idx} className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                            isCompleted ? 'bg-emerald-600 text-white shadow' : 'bg-white border-2 border-gray-300 text-gray-500'
                          } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className={`text-[11px] font-bold mt-2 text-center hidden sm:block ${
                            isCompleted ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <span className="font-bold">This order was cancelled.</span>
                    {order.cancellationReason && <p className="text-[11px] text-gray-600">Reason: {order.cancellationReason}</p>}
                    {order.refundAmount > 0 && <p className="text-[11px] text-emerald-700 font-bold mt-0.5">Refund of ₹{order.refundAmount} has been initiated.</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Shipping & Order Items */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900 pb-2 border-b">Package Contents</h3>
              <div className="divide-y divide-gray-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-white border rounded p-1 flex items-center justify-center shrink-0">
                        <img src={item.productImage} alt={item.productTitle} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 line-clamp-1">{item.productTitle}</h4>
                        <div className="text-gray-500 text-[11px]">Qty: {item.quantity} • Unit Price: ₹{Math.round(item.unitPrice).toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">
                      ₹{Math.round(item.totalPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="pt-3 border-t text-xs text-gray-700">
                <span className="font-bold text-gray-900 block mb-1">Delivering to:</span>
                <p className="leading-relaxed text-gray-600">{order.shippingAddress}</p>
              </div>
            </div>

          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="font-bold text-base text-gray-900">Cancel Order #{order?.orderNumber}?</h3>
              <p className="text-xs text-gray-600">
                Are you sure you want to cancel this order? Stock will be immediately released back to inventory.
              </p>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Reason for cancellation:</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amazon-yellow"
                >
                  <option value="Found cheaper elsewhere">Found cheaper elsewhere</option>
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Need to change delivery address">Need to change delivery address</option>
                  <option value="Delivery date is too late">Delivery date is too late</option>
                  <option value="Changed mind">Changed mind</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
