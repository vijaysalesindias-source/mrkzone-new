import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, Lock } from 'lucide-react';
import AmazonLogo from './AmazonLogo';

export default function Footer({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-12 text-sm text-gray-300">
      {/* Trust Badges Strip */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4">
        <div className="max-w-[1500px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <Truck className="w-6 h-6 text-amazon-yellow" />
            <h4 className="font-bold text-white text-xs">Fast & Free Shipping</h4>
            <p className="text-[11px] text-gray-400">On all eligible orders above ₹499</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <ShieldCheck className="w-6 h-6 text-amazon-yellow" />
            <h4 className="font-bold text-white text-xs">100% Genuine Products</h4>
            <p className="text-[11px] text-gray-400">Brand warranty & tamper-proof seals</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <RotateCcw className="w-6 h-6 text-amazon-yellow" />
            <h4 className="font-bold text-white text-xs">7-Day Easy Returns</h4>
            <p className="text-[11px] text-gray-400">Doorstep pickups & instant refunds</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Lock className="w-6 h-6 text-amazon-yellow" />
            <h4 className="font-bold text-white text-xs">Dynamic UPI & 256-bit SSL</h4>
            <p className="text-[11px] text-gray-400">Safe payments via UPI QR & Gateways</p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] text-white py-3 text-xs font-semibold text-center transition tracking-wide"
      >
        Back to top
      </button>

      {/* Main Footer Links */}
      <div className="bg-amazon-blue py-10 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-white mb-3 text-sm">Get to Know Us</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => onNavigate('home')} className="hover:underline">About Amazon</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:underline">Careers</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:underline">Press Releases</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:underline">Amazon Science</button></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-3 text-sm">Connect with Us</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Twitter / X</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">YouTube</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-3 text-sm">Make Money with Us</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => onNavigate('admin')} className="hover:underline text-amber-300 font-medium">Amazon Seller & Admin Central</button></li>
              <li><a href="#" className="hover:underline">Sell on Amazon</a></li>
              <li><a href="#" className="hover:underline">Fulfilment by Amazon</a></li>
              <li><a href="#" className="hover:underline">Advertise Your Products</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-3 text-sm">Let Us Help You</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => onNavigate('account', { tab: 'profile' })} className="hover:underline">Your Account</button></li>
              <li><button onClick={() => onNavigate('account', { tab: 'orders' })} className="hover:underline">Returns Centre</button></li>
              <li><button onClick={() => onNavigate('track-order')} className="hover:underline">Track Your Order</button></li>
              <li><button onClick={() => onNavigate('account', { tab: 'support' })} className="hover:underline">100% Purchase Protection</button></li>
              <li><button onClick={() => onNavigate('account', { tab: 'support' })} className="hover:underline">Help & Customer Support</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Brand & Language Bar */}
      <div className="bg-amazon-blue border-t border-slate-700 py-6 px-4">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
          <AmazonLogo variant="white" className="h-6 w-auto" />

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 border border-slate-600 rounded text-gray-200">
              🌐 English
            </span>
            <span className="px-3 py-1 border border-slate-600 rounded text-gray-200">
              🇮🇳 India (₹ INR)
            </span>
            <span className="px-3 py-1 border border-slate-600 rounded text-gray-200">
              Warehouse: Mumbai 400072
            </span>
          </div>
        </div>
      </div>

      {/* Subsidiary Directory Grid (Authentic Amazon) */}
      <div className="bg-[#131a22] py-8 px-6 border-t border-slate-800">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-[11px] text-gray-400">
          <div>
            <h5 className="font-bold text-gray-300">AbeBooks</h5>
            <p className="text-gray-500 hover:text-gray-300 cursor-pointer">Books, art & collectibles</p>
          </div>
          <div>
            <h5 className="font-bold text-gray-300">Amazon Web Services</h5>
            <p className="text-gray-500 hover:text-gray-300 cursor-pointer">Scalable Cloud Computing Services</p>
          </div>
          <div>
            <h5 className="font-bold text-gray-300">Audible</h5>
            <p className="text-gray-500 hover:text-gray-300 cursor-pointer">Download Audio Books</p>
          </div>
          <div>
            <h5 className="font-bold text-gray-300">IMDb</h5>
            <p className="text-gray-500 hover:text-gray-300 cursor-pointer">Movies, TV & Celebrities</p>
          </div>
          <div>
            <h5 className="font-bold text-gray-300">Shopbop</h5>
            <p className="text-gray-500 hover:text-gray-300 cursor-pointer">Designer Fashion Brands</p>
          </div>
          <div>
            <h5 className="font-bold text-gray-300">Amazon Business</h5>
            <p className="text-gray-500 hover:text-gray-300 cursor-pointer">Everything For Your Business</p>
          </div>
          <div>
            <h5 className="font-bold text-gray-300">Prime Now</h5>
            <p className="text-gray-500 hover:text-gray-300 cursor-pointer">2-Hour Delivery on Everyday Items</p>
          </div>
          <div>
            <h5 className="font-bold text-gray-300">Amazon Prime Music</h5>
            <p className="text-gray-500 hover:text-gray-300 cursor-pointer">100 million songs, ad-free</p>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="bg-amazon-navy py-6 px-4 text-center text-[11px] text-gray-400 border-t border-slate-800">
        <div className="flex flex-wrap justify-center gap-4 mb-2">
          <a href="#" className="hover:underline">Conditions of Use & Sale</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">Interest-Based Ads</a>
          <a href="#" className="hover:underline">Payment Security</a>
        </div>
        <p>© 1996-2026, Amazon.com, Inc. or its affiliates. All rights reserved.</p>
      </div>
    </footer>
  );
}
