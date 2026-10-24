'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { formatIDR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ShieldCheck } from 'lucide-react';

interface OrderSummaryProps {
  items: any[];
}

export default function OrderSummary({ items }: OrderSummaryProps) {
  const cartItems = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getTotalPrice());
  const shippingCost = 20000; // Fixed flat sample rate or selected option
  const total = subtotal + shippingCost;
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    // Trigger Midtrans Snap (window.snap)
    if (typeof window !== 'undefined' && (window as any).snap) {
      // For demonstration / placeholder if snap token is loaded
      (window as any).snap.pay('SAMPLE-SNAP-TOKEN', {
        onSuccess: function (result: any) {
          console.log('payment success', result);
          window.location.href = '/account';
        },
        onPending: function (result: any) {
          console.log('payment pending', result);
        },
        onError: function (result: any) {
          console.log('payment error', result);
          setLoading(false);
        },
      });
    } else {
      alert('Midtrans Snap SDK not loaded');
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-[#F4EBD9]/10 p-6 space-y-6 sticky top-24">
      <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#F4EBD9] border-b border-[#F4EBD9]/10 pb-4">
        Order Summary
      </h2>

      <div className="space-y-4 max-h-60 overflow-y-auto divide-y divide-[#F4EBD9]/10 pr-2">
        {cartItems.map((item) => (
          <div key={item.variantId} className="flex justify-between items-center pt-3 text-xs">
            <div>
              <p className="font-bold text-[#F4EBD9]">{item.title}</p>
              <p className="text-[#F4EBD9]/60 font-mono">Size: {item.size} × {item.quantity}</p>
            </div>
            <span className="font-mono text-[#D97706] font-bold">
              {formatIDR(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#F4EBD9]/10 pt-4 space-y-2 text-sm font-mono">
        <div className="flex justify-between text-[#F4EBD9]/70">
          <span>Subtotal</span>
          <span>{formatIDR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[#F4EBD9]/70">
          <span>Shipping (JNE REG)</span>
          <span>{formatIDR(shippingCost)}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-[#F4EBD9] pt-2 border-t border-[#F4EBD9]/10">
          <span>Total</span>
          <span className="text-[#D97706] font-mono">{formatIDR(total)}</span>
        </div>
      </div>

      <Button
        onClick={handlePay}
        isLoading={loading}
        className="w-full bg-[#D97706] text-[#121212] py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#F4EBD9] transition-colors"
      >
        Pay with Midtrans Snap
      </Button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-[#F4EBD9]/50 font-mono">
        <ShieldCheck className="h-4 w-4 text-[#D97706]" /> Secure 256-Bit Encrypted Payment
      </div>
    </div>
  );
}
