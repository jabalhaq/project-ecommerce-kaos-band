'use client';

import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cart-store';

interface AddToCartButtonProps {
  product: {
    id: string;
    title?: string;
    name?: string;
    base_price: number;
    images?: string[] | null;
    variants?: any[];
  };
  inventory?: { id: string; size: string; stock_quantity: number }[];
}

export default function AddToCartButton({ product, inventory }: AddToCartButtonProps) {
  const stockItems = inventory || product.variants || [];
  const [selectedSize, setSelectedSize] = useState<string>(stockItems[0]?.size || 'L');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const title = product.title || product.name || 'Untitled Drop';
  const imageUrl = product.images?.[0] || '';

  const selectedVariant = stockItems.find((v: any) => v.size === selectedSize) || stockItems[0];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || `${product.id}-${selectedSize}`,
      title,
      size: selectedSize,
      price: product.base_price,
      imageUrl,
      quantity,
      weight: 250,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Size Selector */}
      <div>
        <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-3">
          Select Size <span className="text-[#D97706]">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {(stockItems.length > 0
            ? stockItems
            : [
                { id: 's', size: 'S', stock_quantity: 10 },
                { id: 'm', size: 'M', stock_quantity: 10 },
                { id: 'l', size: 'L', stock_quantity: 10 },
                { id: 'xl', size: 'XL', stock_quantity: 10 },
                { id: 'xxl', size: 'XXL', stock_quantity: 10 },
              ]
          ).map((inv: any) => (
            <button
              key={inv.id || inv.size}
              onClick={() => setSelectedSize(inv.size)}
              disabled={inv.stock_quantity === 0}
              className={`w-12 h-12 flex items-center justify-center font-mono text-xs uppercase border transition-colors ${
                selectedSize === inv.size
                  ? 'border-[#D97706] bg-[#D97706] text-[#121212] font-bold'
                  : 'border-[#F4EBD9]/20 bg-zinc-900 text-[#F4EBD9] hover:border-[#D97706]'
              } ${inv.stock_quantity === 0 ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
            >
              {inv.size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div>
        <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-3">Quantity</label>
        <div className="flex items-center border border-[#F4EBD9]/20 bg-zinc-900 w-32">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-[#F4EBD9] hover:text-[#D97706]"
          >
            -
          </button>
          <span className="flex-1 text-center font-mono text-sm text-[#F4EBD9]">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 text-[#F4EBD9] hover:text-[#D97706]"
          >
            +
          </button>
        </div>
      </div>

      {/* Add Button */}
      <Button
        onClick={handleAddToCart}
        className="w-full bg-[#D97706] text-[#121212] py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#F4EBD9] transition-colors flex items-center justify-center gap-2"
      >
        <ShoppingBag className="h-4 w-4" />
        {added ? 'Added to Crate!' : 'Add to Crate'}
      </Button>
    </div>
  );
}
