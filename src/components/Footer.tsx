import React from 'react';
import Link from 'next/link';
import { Disc, Mail, Globe, Share2, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-[#F4EBD9] border-t border-[#F4EBD9]/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <Disc className="h-6 w-6 text-[#D97706]" />
              <span
                className="text-lg font-black tracking-wider text-[#F4EBD9]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                THE VINYL CRATE
              </span>
            </div>
            <p className="text-xs text-[#F4EBD9]/60 leading-relaxed font-sans">
              Curated band merch for true collectors. Authentic vintage-styled merchandise from metal, punk, grunge, and classic rock legends.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D97706]">Explore</h4>
            <ul className="space-y-2 text-sm text-[#F4EBD9]/80 font-sans">
              <li>
                <Link href="/shop" className="hover:text-[#D97706] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?origin=IMPORT" className="hover:text-[#D97706] transition-colors">
                  Import Editions
                </Link>
              </li>
              <li>
                <Link href="/shop?origin=IN_HOUSE" className="hover:text-[#D97706] transition-colors">
                  In-House Custom
                </Link>
              </li>
              <li>
                <Link href="/shop?genre=Metal" className="hover:text-[#D97706] transition-colors">
                  Metal & Grunge
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D97706]">Support</h4>
            <ul className="space-y-2 text-sm text-[#F4EBD9]/80 font-sans">
              <li>
                <Link href="/account" className="hover:text-[#D97706] transition-colors">
                  Order Status
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#D97706] transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#D97706] transition-colors">
                  FAQ & Sizing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D97706] transition-colors">
                  Contact Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D97706]">Stay Connected</h4>
            <p className="text-xs text-[#F4EBD9]/60">Get notified when rare drops and new crates go live.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-zinc-900 border border-[#F4EBD9]/20 text-[#F4EBD9] px-3 py-2 text-xs w-full focus:border-[#D97706] outline-none"
              />
              <button
                aria-label="Subscribe to newsletter"
                className="bg-[#D97706] text-[#121212] px-4 py-2 hover:bg-[#F4EBD9] transition-colors flex items-center justify-center"
              >
                <Mail className="h-4 w-4" />
              </button>
            </div>
            <div className="flex space-x-4 pt-2">
              <a href="#" aria-label="Globe" className="text-[#F4EBD9]/60 hover:text-[#D97706] transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Share" className="text-[#F4EBD9]/60 hover:text-[#D97706] transition-colors">
                <Share2 className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Community" className="text-[#F4EBD9]/60 hover:text-[#D97706] transition-colors">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F4EBD9]/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F4EBD9]/50">
          <p>&copy; 2026 The Vinyl Crate. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-[#F4EBD9]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#F4EBD9]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
