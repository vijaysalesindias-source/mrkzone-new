import React, { useEffect, useState } from 'react';
import { X, MapPin, Truck, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { metaApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function PincodeCheckerModal({ isOpen, onClose }) {
  const { deliveryPincode, setDeliveryPincode } = useCart();
  const [inputPincode, setInputPincode] = useState(deliveryPincode || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { success, error } = useToast();

  useEffect(() => {
    if (isOpen) {
      setInputPincode(deliveryPincode || '');
      setResult(null);
    }
  }, [isOpen, deliveryPincode]);

  if (!isOpen) return null;

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!/^[1-9][0-9]{5}$/.test(inputPincode.trim())) {
      error('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    setLoading(true);
    try {
      const res = await metaApi.checkDelivery(inputPincode.trim(), 1000);
      setResult(res.data);
      if (res.data?.serviceable) {
        setDeliveryPincode(inputPincode.trim());
        localStorage.setItem('mrkzone_pincode', inputPincode.trim());
        success(`Delivery location updated to ${res.data.zoneName}`);
      }
    } catch (err) {
      error(err.message || 'Failed to check PIN code');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyQuickPin = (pin) => {
    setInputPincode(pin);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-amazon-navy text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amazon-yellow" />
            <h3 className="font-bold text-base">Choose your delivery location</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            Delivery options and speeds may vary based on your area. All orders are fulfilled from our central warehouse in <b>Mumbai (PIN 400072)</b>.
          </p>

          <form onSubmit={handleCheck} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={inputPincode}
                onChange={(e) => { setInputPincode(e.target.value.replace(/\D/g, '').slice(0, 6)); setResult(null); }}
                placeholder="Enter 6-digit PIN code"
                className="flex-1 border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-yellow"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold px-5 py-2.5 rounded-lg text-xs transition disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Apply'}
              </button>
            </div>
          </form>

          {/* Quick Select Cities */}
          <div className="mt-4 pt-3 border-t">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Popular Fulfillment Destinations
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { name: 'Mumbai (400001)', pin: '400001' },
                { name: 'Delhi (110001)', pin: '110001' },
                { name: 'Bengaluru (560001)', pin: '560001' },
                { name: 'Hyderabad (500001)', pin: '500001' },
                { name: 'Pune (411001)', pin: '411001' },
                { name: 'Kolkata (700001)', pin: '700001' },
              ].map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyQuickPin(loc.pin)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-amber-100 rounded text-gray-700 transition"
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Result details */}
          {result && (
            <div className={`mt-5 p-3.5 rounded-lg border text-xs ${
              result.serviceable ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              {result.serviceable ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Deliverable to {result.zoneName} ({result.pincode})</span>
                  </div>
                  <p className="text-gray-700">
                    Estimated Delivery: <b>{result.formattedDeliveryDate}</b> ({result.estimatedDays} {result.estimatedDays === 1 ? 'day' : 'days'})
                  </p>
                  <p className="text-gray-600 text-[11px]">
                    Standard Shipping: <b>{result.standardShippingFee === 0 ? 'FREE' : `₹${result.standardShippingFee}`}</b> (FREE for orders ₹499+)
                  </p>
                  {result.expressAvailable && (
                    <p className="text-gray-600 text-[11px]">
                      ⚡ Express Delivery Available: <b>₹{result.expressShippingFee}</b>
                    </p>
                  )}
                  <p className="text-[10px] text-gray-500 italic mt-1">
                    * Delivery dates are estimates based on standard courier dispatch schedules.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{result.message}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
