import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle, Package, Truck, Printer, ArrowRight, ShieldCheck, Download
} from 'lucide-react';
import InvoiceView from '../components/InvoiceView';

export default function OrderSuccessPage({ order, payment, onNavigate }) {
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Completed</h2>
        <button
          onClick={() => onNavigate('home')}
          className="bg-amazon-yellow px-6 py-2 rounded-full font-bold text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#eaeded] min-h-screen pb-16">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Success Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
            Thank you, your order has been placed!
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            An order confirmation and tax invoice have been dispatched to <b>{order.customerEmail}</b>
          </p>

          {/* Order Details Strip */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-xs text-left grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-gray-500 block">Order Number</span>
              <span className="font-bold text-gray-900 font-mono text-sm">{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Estimated Delivery</span>
              <span className="font-bold text-emerald-700">{order.estimatedDeliveryDate || '3 Business Days'}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Total Amount</span>
              <span className="font-bold text-gray-900 text-sm">
                ₹{Math.round(order.finalAmount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('track-order', { orderNumber: order.orderNumber })}
              className="bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold px-6 py-2.5 rounded-full text-xs transition shadow-sm flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track Your Package</span>
            </button>

            <button
              onClick={() => setShowInvoice(!showInvoice)}
              className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold px-6 py-2.5 rounded-full text-xs transition shadow-sm flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>{showInvoice ? 'Hide Invoice' : 'View & Print Tax Invoice'}</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="bg-slate-900 hover:bg-black text-white font-bold px-6 py-2.5 rounded-full text-xs transition shadow-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Invoice Modal / Accordion */}
        {showInvoice && (
          <div className="mt-8 animate-fade-in">
            <InvoiceView order={order} />
          </div>
        )}

      </div>
    </div>
  );
}
