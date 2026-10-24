'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  onCartOpen?: () => void;
  onAuthOpen?: () => void;
}

export const Navbar = ({ onCartOpen, onAuthOpen }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getTotalItems());
  const { user, clearUser } = useAuthStore();

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/genres', label: 'Genres' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 bg-[#121212] text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-bold tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>
          THE VINYL CRATE
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm tracking-wide">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-amber-400 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="relative p-2 hover:text-amber-400 transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          {/* User */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-sm text-zinc-400">{user.full_name || 'Collector'}</span>
              <Button variant="ghost" className="p-2 text-sm" onClick={clearUser}>
                Sign Out
              </Button>
            </div>
          ) : (
            <button
              onClick={onAuthOpen}
              className="p-2 hover:text-amber-400 transition-colors"
              aria-label="Sign In"
            >
              <User className="h-5 w-5" />
            </button>
          )}

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 hover:text-amber-400 transition-colors"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden md:hidden bg-[#1A1A1A] border-t border-zinc-800"
          >
            <nav className="flex flex-col py-4 px-6 space-y-4 text-sm tracking-wide">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="hover:text-amber-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
