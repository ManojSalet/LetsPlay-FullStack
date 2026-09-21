import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-black text-white">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span>Let's Play</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your premier destination for high-performance sports equipment, gear, and apparel for athletes of all levels.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Shop Sports
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/category" className="hover:text-white transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link to="/category" className="hover:text-white transition-colors">
                  Outdoor Sports
                </Link>
              </li>
              <li>
                <Link to="/category" className="hover:text-white transition-colors">
                  Indoor Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support & Policies
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Terms & Conditions
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Shipping & Returns
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Help & FAQs
                </span>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              My Account
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  View Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/orderhistory" className="hover:text-white transition-colors">
                  Order History
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Let's Play Online. All rights reserved.</p>
          <p>Crafted for professional performance and durability.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
