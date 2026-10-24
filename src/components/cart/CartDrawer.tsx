'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import CartItem from './CartItem';
import { formatIDR } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#121212] border-l border-[#F4EBD9]/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#F4EBD9]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#D97706]" />
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#F4EBD9] font-bold">
                  Your Crate ({items.length})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#F4EBD9]/60 hover:text-[#F4EBD9] transition-colors"
                aria-label="Close Cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#F4EBD9]/10">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-[#F4EBD9]/60 py-20">
                  <span className="text-5xl">🛒</span>
                  <p className="font-[family-name:var(--font-playfair)] text-lg text-[#F4EBD9]">Your crate is empty</p>
                  <p className="text-xs max-w-xs">Explore our archive of rare band merch and add your favorite tees.</p>
                </div>
              ) : (
                items.map((item) => <CartItem key={item.variantId} item={item} />)
              )}
            </div>

            {/* Footer / Subtotal / Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#F4EBD9]/10 bg-zinc-950 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#F4EBD9]/60 font-mono uppercase text-xs">Subtotal</span>
                  <span className="text-lg font-bold font-mono text-[#D97706]">
                    {formatIDR(totalPrice)}
                  </span>
                </div>
                <p className="text-[11px] text-[#F4EBD9]/40 font-mono">
                  Shipping and taxes calculated during checkout via Biteship.
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#D97706] text-[#121212] py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#F4EBD9] transition-colors"
                >
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
