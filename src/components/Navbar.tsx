'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Menu, X, Disc, LogOut, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  onCartOpen?: () => void;
  onAuthOpen?: () => void;
}

export default function Navbar({ onCartOpen, onAuthOpen }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, clearUser } = useAuthStore();

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/shop?genre=Metal', label: 'Genres' },
    { href: '/account', label: 'Account' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121212]/95 backdrop-blur border-b border-[#F4EBD9]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Disc className="h-7 w-7 text-[#D97706] group-hover:rotate-180 transition-transform duration-700" />
          <span
            className="text-xl sm:text-2xl font-black text-[#F4EBD9] tracking-wider"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            THE VINYL CRATE
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest font-medium text-[#F4EBD9]/80">
          <Link href="/shop" className="hover:text-[#D97706] transition-colors">
            Shop
          </Link>
          <Link href="/shop" className="hover:text-[#D97706] transition-colors">
            Genres
          </Link>
          <Link href="/account" className="hover:text-[#D97706] transition-colors">
            Account
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <button
            onClick={onCartOpen}
            className="relative p-2 text-[#F4EBD9] hover:text-[#D97706] transition-colors"
            aria-label="Open Cart"
          >
            <ShoppingBag className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D97706] text-[#121212] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Profile Dropdown or Auth Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded bg-zinc-900 border border-[#F4EBD9]/20 hover:border-[#D97706] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#D97706]/20 text-[#D97706] flex items-center justify-center font-bold text-xs uppercase">
                  {user.full_name?.[0] || 'U'}
                </div>
                <span className="hidden sm:inline text-xs text-[#F4EBD9] max-w-[100px] truncate">
                  {user.full_name || 'Collector'}
                </span>
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-[#F4EBD9]/20 shadow-xl py-2 z-50"
                  >
                    <Link
                      href="/account"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#F4EBD9] hover:bg-[#D97706]/10 hover:text-[#D97706]"
                    >
                      <Package className="h-4 w-4" /> Order History
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#F4EBD9] hover:bg-[#D97706]/10 hover:text-[#D97706]"
                      >
                        <Disc className="h-4 w-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        clearUser();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 text-left"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={onAuthOpen}
              className="flex items-center gap-2 px-4 py-2 bg-[#D97706] text-[#121212] text-xs font-bold uppercase tracking-widest hover:bg-[#F4EBD9] transition-colors"
            >
              <User className="h-4 w-4" /> Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F4EBD9] hover:text-[#D97706]"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-b border-[#F4EBD9]/10 px-6 py-6 space-y-4"
          >
            <nav className="flex flex-col space-y-4 text-sm uppercase tracking-widest font-medium text-[#F4EBD9]">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D97706] transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/shop?genre=Metal"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D97706] transition-colors"
              >
                Genres
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D97706] transition-colors"
              >
                Account
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
