import React from 'react';
import { Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import AmazonLogo from './AmazonLogo';

export default function InvoiceView({ order }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const subtotal = order.totalAmount || 0;
  const discount = order.discountAmount || 0;
  const taxableValue = subtotal - discount;
  const cgst = Math.round(taxableValue * 0.09 * 100) / 100;
  const sgst = Math.round(taxableValue * 0.09 * 100) / 100;

  return (
    <div className="bg-white rounded-xl p-6 sm:p-10 border border-gray-300 shadow-md max-w-3xl mx-auto text-xs text-gray-800" id="printable-invoice">
      {/* Top Controls */}
      <div className="flex justify-between items-center pb-4 border-b no-print mb-6">
        <div>
          <span className="font-bold text-sm text-gray-900">Tax Invoice / Bill of Supply</span>
          <p className="text-[11px] text-gray-500">Original for Recipient</p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Invoice Header */}
      <div className="flex justify-between items-start gap-4 pb-6 border-b">
        <div>
          <div className="pb-1">
            <AmazonLogo variant="dark" className="h-7 w-auto" />
          </div>
          <div className="text-[11px] text-gray-600 mt-1 leading-relaxed">
            <span className="font-bold block text-gray-800">Amazon Retail India Private Limited</span>
            <span>Central Fulfillment Hub, Warehouse No. 4, Sakinaka,</span><br />
            <span>Mumbai, Maharashtra - 400072, India</span><br />
            <span>GSTIN: <b>27AABCM9812K1Z8</b> | PAN: AABCM9812K</span>
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Tax Invoice</h2>
          <div className="text-[11px] text-gray-600 mt-1 space-y-0.5">
            <div>Invoice No: <b>INV-{order.orderNumber}</b></div>
            <div>Invoice Date: <b>{invoiceDate}</b></div>
            <div>Order ID: <b>{order.orderNumber}</b></div>
            <div>Payment: <b>{order.paymentMethod} ({order.paymentStatus})</b></div>
          </div>
        </div>
      </div>

      {/* Billing & Shipping Address */}
      <div className="grid grid-cols-2 gap-6 py-4 border-b text-[11px]">
        <div>
          <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-1">Billing Details:</h3>
          <div className="font-semibold text-gray-800">{order.customerName}</div>
          <div className="text-gray-600 leading-relaxed">{order.shippingAddress}</div>
          <div className="text-gray-600">Email: {order.customerEmail}</div>
          <div className="text-gray-600">Phone: {order.customerPhone}</div>
          <div className="text-gray-500 mt-0.5">Place of Supply: Maharashtra (27)</div>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-1">Shipping Details:</h3>
          <div className="font-semibold text-gray-800">{order.customerName}</div>
          <div className="text-gray-600 leading-relaxed">{order.shippingAddress}</div>
          <div className="text-gray-600">Carrier: {order.courierName || 'Delhivery Express'}</div>
          <div className="text-gray-600 font-mono">AWB Tracking: {order.trackingNumber || 'DELH891283'}</div>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="py-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-y border-gray-300 font-bold text-gray-700 text-[11px]">
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-2">Description</th>
              <th className="py-2 px-2">HSN</th>
              <th className="py-2 px-2 text-center">Qty</th>
              <th className="py-2 px-2 text-right">Net Price</th>
              <th className="py-2 px-2 text-right">GST (18%)</th>
              <th className="py-2 px-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-[11px]">
            {order.items?.map((item, idx) => {
              const itemTotal = item.unitPrice * item.quantity;
              const itemGst = Math.round(itemTotal * 0.18 * 100) / 100;
              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-2 px-2">{idx + 1}</td>
                  <td className="py-2 px-2 font-medium text-gray-900">
                    {item.productTitle}
                    <div className="text-[10px] text-gray-500 font-mono">SKU: {item.productSku || 'AMZ-SKU'}</div>
                  </td>
                  <td className="py-2 px-2 font-mono text-gray-600">85171300</td>
                  <td className="py-2 px-2 text-center font-bold">{item.quantity}</td>
                  <td className="py-2 px-2 text-right">₹{Math.round(item.unitPrice).toLocaleString('en-IN')}</td>
                  <td className="py-2 px-2 text-right">₹{Math.round(itemGst).toLocaleString('en-IN')}</td>
                  <td className="py-2 px-2 text-right font-bold text-gray-900">
                    ₹{Math.round(itemTotal).toLocaleString('en-IN')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tax Summary & Breakdown */}
      <div className="pt-3 border-t grid grid-cols-2 gap-4">
        <div className="text-[11px] text-gray-600 space-y-1">
          <div className="font-bold text-gray-800">GST Breakdown (18% Integrated):</div>
          <div>Central GST (CGST 9%): ₹{cgst.toLocaleString('en-IN')}</div>
          <div>State GST (SGST 9%): ₹{sgst.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-gray-500 pt-2">
            * Whether tax is payable under reverse charge: <b>No</b>
          </div>
        </div>

        <div className="text-right space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span>₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Coupon Discount:</span>
              <span>-₹{Math.round(discount).toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping & Delivery:</span>
            <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
          </div>
          <div className="flex justify-between font-black text-sm pt-2 border-t text-gray-950">
            <span>Final Amount:</span>
            <span>₹{Math.round(order.finalAmount).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Authorized Signature */}
      <div className="pt-8 border-t mt-6 flex justify-between items-end text-[11px] text-gray-500">
        <div>
          <p>Thank you for shopping on Amazon.in.</p>
          <p>For support, visit: <b>www.amazon.in/help</b> | Toll-Free: 1800-3000-9009</p>
        </div>
        <div className="text-center">
          <div className="font-cursive text-base font-bold text-gray-800 mb-0.5">Amazon Retail India Pvt Ltd</div>
          <div className="border-t border-gray-400 pt-1 text-[10px] uppercase font-bold text-gray-700">
            Authorized Signatory
          </div>
        </div>
      </div>
    </div>
  );
}
