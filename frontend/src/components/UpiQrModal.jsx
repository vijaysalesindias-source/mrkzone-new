import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Check, Copy, AlertTriangle, ShieldCheck, Clock, Smartphone, RefreshCw } from 'lucide-react';
import { paymentApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function UpiQrModal({ isOpen, onClose, order, onPaymentSuccess }) {
  const [upiDetails, setUpiDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [utrInput, setUtrInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const { success, error, warning } = useToast();

  useEffect(() => {
    if (isOpen && order?.orderNumber) {
      setLoading(true);
      paymentApi.getUpiDetails(order.orderNumber)
        .then(res => {
          setUpiDetails(res.data);
          setLoading(false);
        })
        .catch(err => {
          error(err.message || 'Could not fetch UPI payment details');
          setLoading(false);
        });
      setTimeLeft(600);
    }
  }, [isOpen, order]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  if (!isOpen || !order) return null;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCopyUpiId = () => {
    if (upiDetails?.merchantUpiId) {
      navigator.clipboard.writeText(upiDetails.merchantUpiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      success('Merchant UPI ID copied to clipboard!');
    }
  };

  const handleVerifyPayment = async (customUtr = null) => {
    const utr = customUtr || utrInput.trim();
    if (!utr) {
      warning('Please enter the 12-digit UPI Reference Number / UTR from your UPI payment app');
      return;
    }

    setVerifying(true);
    try {
      const res = await paymentApi.verifyUpi({
        orderNumber: order.orderNumber,
        upiRefId: utr
      });

      if (res.data) {
        warning('UTR submitted. The order remains Pending until you confirm the credit in your bank account.');
        onClose();
      }
    } catch (err) {
      error(err.message || 'Payment verification failed. Check UTR and try again.');
    } finally {
      setVerifying(false);
    }
  };



  const upiUri = upiDetails?.upiUri || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up my-8">

        {/* Header */}
        <div className="bg-amazon-navy text-white px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amazon-yellow" />
            <div>
              <h3 className="font-bold text-base">Scan Dynamic UPI QR Code</h3>
              <p className="text-[11px] text-gray-300">Order #{order.orderNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Payable Amount Badge */}
          <div className="flex items-center justify-between p-3 sm:p-3.5 bg-amber-50 border border-amber-200 rounded-xl mb-4">
            <div>
              <span className="text-xs text-gray-600 block">Total Payable Amount</span>
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                ₹{Math.round(order.finalAmount).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1.5 rounded-lg">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>Expires in {formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Genuine Dynamic QR Canvas */}
          <div className="flex flex-col items-center justify-center py-1">
            <div className="p-3 sm:p-4 bg-white border-2 border-dashed border-gray-300 rounded-2xl shadow-inner relative group">
              <QRCodeSVG
                value={upiUri}
                size={200}
                level="H"
                includeMargin={true}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition bg-white/10 backdrop-blur-[1px] rounded-2xl">
                <span className="bg-amazon-navy text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                  Order-specific UPI QR
                </span>
              </div>
            </div>

            {/* Merchant Details */}
            <div className="mt-3 text-center">
              <div className="text-xs text-gray-500 font-medium">Merchant Payee</div>
              <div className="font-bold text-sm text-gray-900 flex items-center justify-center gap-1">
                <span>{upiDetails?.merchantName || 'Merchant'}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-700">
                  {upiDetails?.merchantUpiId || 'Configure merchant UPI ID'}
                </code>
                <button
                  onClick={handleCopyUpiId}
                  className="text-xs text-amazon-link hover:underline flex items-center gap-0.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Supported Apps Logos */}
            <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-gray-500 font-medium">
              <span className="px-2 py-1 bg-gray-50 border rounded">GPay</span>
              <span className="px-2 py-1 bg-gray-50 border rounded">PhonePe</span>
              <span className="px-2 py-1 bg-gray-50 border rounded">Paytm</span>
              <span className="px-2 py-1 bg-gray-50 border rounded">BHIM</span>
              <span className="px-2 py-1 bg-gray-50 border rounded">Cred</span>
            </div>
          </div>

          {/* Strict Verification Note */}
          <div className="mt-5 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <b>Security Requirement:</b> Submitting a UTR does not confirm payment. The order remains Pending until the merchant verifies the bank credit.
            </p>
          </div>

          {/* UTR Verification Input */}
          <div className="mt-4 pt-4 border-t space-y-2">
            <label className="text-xs font-bold text-gray-700 block">
              Enter UPI Transaction ID / 12-digit UTR from your bank SMS / app:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={utrInput}
                onChange={(e) => setUtrInput(e.target.value)}
                placeholder="e.g. 431982710294"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amazon-yellow"
              />
              <button
                onClick={() => handleVerifyPayment()}
                disabled={verifying}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {verifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{verifying ? 'Submitting...' : 'Submit UTR'}</span>
              </button>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
}
