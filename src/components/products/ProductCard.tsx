'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Disc } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatIDR } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';

interface ProductCardProps {
  product: {
    id: string;
    title?: string;
    name?: string;
    slug: string;
    base_price: number;
    images?: string[] | null;
    origin_type: 'IMPORT' | 'IN_HOUSE';
    genre?: string | null;
    inventory?: { id: string; size: string; stock_quantity: number }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const title = product.title || product.name || 'Untitled Drop';
  const imageUrl = product.images?.[0] || '';
  const secondaryImageUrl = product.images?.[1] || imageUrl;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first inventory variant or fallback dummy variant
    const variant = product.inventory?.[0];
    addItem({
      productId: product.id,
      variantId: variant?.id || `${product.id}-default`,
      title,
      size: variant?.size || 'L',
      price: product.base_price,
      imageUrl,
      quantity: 1,
      weight: 250,
    });
  };

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <motion.div
        className="relative bg-zinc-900 border border-[#F4EBD9]/10 rounded-none overflow-hidden transition-all duration-300 group-hover:border-[#D97706]"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
      >
        {/* 1:1 Vinyl Sleeve Container */}
        <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img
              src={isHovered ? secondaryImageUrl : imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-[#F4EBD9]/20">
              <Disc className="h-16 w-16 animate-spin-slow" />
              <span className="text-xs uppercase font-mono mt-2">Vinyl Crate</span>
            </div>
          )}

          {/* Origin Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge variant={product.origin_type === 'IMPORT' ? 'import' : 'inhouse'}>
              {product.origin_type === 'IMPORT' ? 'Import' : 'In-House'}
            </Badge>
          </div>

          {/* Quick Add Overlay Button */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-[#D97706] text-[#121212] py-2.5 px-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#F4EBD9] transition-colors"
            >
              <ShoppingBag className="h-4 w-4" /> Quick Add
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-4 space-y-1.5 bg-[#121212]">
          {product.genre && (
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#D97706]">
              {product.genre}
            </p>
          )}
          <h3
            className="font-[family-name:var(--font-playfair)] text-base font-bold text-[#F4EBD9] truncate group-hover:text-[#D97706] transition-colors"
            title={title}
          >
            {title}
          </h3>
          <p className="text-sm font-bold text-[#D97706] font-mono">
            {formatIDR(product.base_price)}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
