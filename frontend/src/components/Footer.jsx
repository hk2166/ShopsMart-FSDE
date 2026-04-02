import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <h3 className="text-2xl font-black tracking-[0.15em] uppercase mb-4">
              Velostyle
            </h3>
            <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
              Your favourite brands, at your door in 60 minutes. Currently
              serving Pune with premium fashion delivered fast.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-5">
              Shop
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/brands"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  All Brands
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Men"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Women"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Women
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-5">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Partner with us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Velostyle. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Made with care in Pune, India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
