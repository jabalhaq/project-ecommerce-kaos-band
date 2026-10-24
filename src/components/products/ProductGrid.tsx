import React from 'react';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

interface ProductGridProps {
  products: any[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 border border-[#F4EBD9]/10 p-4 space-y-4">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-[#F4EBD9]/20 p-8 space-y-4">
        <span className="text-4xl">📭</span>
        <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#F4EBD9]">No crates found</h3>
        <p className="text-sm text-[#F4EBD9]/60 max-w-md mx-auto">
          We couldn&apos;t find any band merchandise matching your filters. Try resetting your search or exploring another genre.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
