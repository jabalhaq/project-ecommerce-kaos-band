'use client';

import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatIDR } from '@/lib/utils';
import { useCartStore, type CartItem as CartItemType } from '@/stores/cart-store';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-4 py-4 border-b border-[#F4EBD9]/10 items-center">
      {/* Thumbnail */}
      <div className="w-16 h-16 bg-zinc-900 border border-[#F4EBD9]/10 relative flex-shrink-0">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#F4EBD9]/30">Tee</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-[family-name:var(--font-playfair)] text-sm font-bold text-[#F4EBD9] truncate">
          {item.title}
        </h4>
        <div className="flex items-center gap-3 text-xs text-[#F4EBD9]/60 font-mono mt-1">
          <span>Size: <strong className="text-[#D97706]">{item.size}</strong></span>
          <span>{formatIDR(item.price)}</span>
        </div>

        {/* Qty Controls */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-[#F4EBD9]/20 bg-zinc-900">
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="p-1 hover:text-[#D97706] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-2.5 text-xs font-mono text-[#F4EBD9]">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="p-1 hover:text-[#D97706] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.variantId)}
            className="text-[#F4EBD9]/40 hover:text-red-400 transition-colors p-1"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Total price for item */}
      <div className="text-right">
        <span className="text-sm font-bold font-mono text-[#D97706]">
          {formatIDR(item.price * item.quantity)}
        </span>
      </div>
    </div>
  );
}
