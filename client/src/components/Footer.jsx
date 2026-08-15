import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      {/* Value Propositions Strip */}
      <div className="border-b border-slate-800 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Free Express Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">On all orders over ฿1,500</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">2-Year Official Warranty</h4>
                <p className="text-xs text-slate-400 mt-0.5">100% authentic genuine products</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-600/10 text-amber-400 rounded-xl border border-amber-500/20">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">30-Day Money Back</h4>
                <p className="text-xs text-slate-400 mt-0.5">Hassle-free return policy</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-500/20">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">24/7 Dedicated Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Expert customer assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-xl font-extrabold tracking-tight text-white">
              <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <span>ShopSphere</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Curated premium lifestyle, audio, and workspace technology engineered for peak everyday performance.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              <span>Secure Payments powered by Stripe</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop" className="hover:text-indigo-400 transition-colors">All Products</Link></li>
              <li><Link to="/shop" className="hover:text-indigo-400 transition-colors">Smart Audio</Link></li>
              <li><Link to="/shop" className="hover:text-indigo-400 transition-colors">Wearable Tech</Link></li>
              <li><Link to="/shop" className="hover:text-indigo-400 transition-colors">Workspace & Desk</Link></li>
              <li><Link to="/shop" className="hover:text-indigo-400 transition-colors">Minimalist Essentials</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Create Account</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400 transition-colors">Shopping Cart</Link></li>
              <li><Link to="/user/history" className="hover:text-indigo-400 transition-colors">Order History</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Stay Updated</h4>
            <p className="text-xs text-slate-400 mb-3">Subscribe for exclusive releases and 10% off your first order.</p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center">
            Designed for peak performance & privacy
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
