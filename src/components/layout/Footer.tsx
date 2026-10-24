import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-[#121212] text-[#F4EBD9] border-t border-zinc-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold font-serif mb-4 text-[#D97706]">THE VINYL CRATE</h3>
          <p className="text-sm text-zinc-400">
            The Vinyl Crate Experience — Bringing the analog soul back to band merchandise. Authentic, timeless, and curated.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 tracking-wider uppercase">Shop</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><Link href="/shop" className="hover:text-amber-500 transition">All T-Shirts</Link></li>
            <li><Link href="/genres/metal" className="hover:text-amber-500 transition">Metal</Link></li>
            <li><Link href="/genres/punk" className="hover:text-amber-500 transition">Punk</Link></li>
            <li><Link href="/genres/grunge" className="hover:text-amber-500 transition">Grunge</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 tracking-wider uppercase">About</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><Link href="/about" className="hover:text-amber-500 transition">Our Story</Link></li>
            <li><Link href="/quality" className="hover:text-amber-500 transition">Quality & Sizing</Link></li>
            <li><Link href="/shipping" className="hover:text-amber-500 transition">Shipping & Returns</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 tracking-wider uppercase">Connect</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><a href="#" className="hover:text-amber-500 transition">Instagram</a></li>
            <li><a href="#" className="hover:text-amber-500 transition">Twitter / X</a></li>
            <li><a href="#" className="hover:text-amber-500 transition">Spotify Playlist</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-500">
        <p>&copy; 2026 The Vinyl Crate. All rights reserved.</p>
      </div>
    </footer>
  );
};
