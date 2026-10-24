'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, ChevronDown } from 'lucide-react';

const GENRES = ['Metal', 'Punk', 'Grunge', 'Classic Rock'];
const ORIGINS = [
  { label: 'Import', value: 'IMPORT' },
  { label: 'In-House', value: 'IN_HOUSE' },
];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentGenre = searchParams.get('genre');
  const currentOrigin = searchParams.get('origin');
  const currentSize = searchParams.get('size');
  const searchQuery = searchParams.get('search');

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const clearAll = () => {
    router.push('/shop');
  };

  const hasFilters = currentGenre || currentOrigin || currentSize || searchQuery;

  return (
    <div className="bg-zinc-900 border border-[#F4EBD9]/10 p-4 sm:p-6 mb-8">
      {/* Mobile Toggle */}
      <div className="flex items-center justify-between lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm text-[#F4EBD9] font-mono uppercase tracking-wider"
        >
          <Filter className="h-4 w-4 text-[#D97706]" /> Filter Crate
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-[#D97706] hover:underline uppercase font-mono"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Filter Content (collapsible on mobile, always open on lg) */}
      <div className={`mt-4 lg:mt-0 space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="flex items-center justify-between hidden lg:flex border-b border-[#F4EBD9]/10 pb-3">
          <h3 className="font-[family-name:var(--font-playfair)] text-base text-[#D97706] font-bold">
            Filter Archive
          </h3>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-[#D97706] hover:underline uppercase font-mono flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Reset
            </button>
          )}
        </div>

        {/* Genre Chips */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-2.5">Genre</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateParam('genre', null)}
              className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors ${
                !currentGenre
                  ? 'bg-[#D97706] text-[#121212] font-bold'
                  : 'bg-zinc-800 text-[#F4EBD9]/70 hover:bg-zinc-700'
              }`}
            >
              All
            </button>
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => updateParam('genre', genre)}
                className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors ${
                  currentGenre === genre
                    ? 'bg-[#D97706] text-[#121212] font-bold'
                    : 'bg-zinc-800 text-[#F4EBD9]/70 hover:bg-zinc-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Origin Chips */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-2.5">Origin</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateParam('origin', null)}
              className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors ${
                !currentOrigin
                  ? 'bg-[#D97706] text-[#121212] font-bold'
                  : 'bg-zinc-800 text-[#F4EBD9]/70 hover:bg-zinc-700'
              }`}
            >
              All
            </button>
            {ORIGINS.map((orig) => (
              <button
                key={orig.value}
                onClick={() => updateParam('origin', orig.value)}
                className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors ${
                  currentOrigin === orig.value
                    ? 'bg-[#D97706] text-[#121212] font-bold'
                    : 'bg-zinc-800 text-[#F4EBD9]/70 hover:bg-zinc-700'
                }`}
              >
                {orig.label}
              </button>
            ))}
          </div>
        </div>

        {/* Size Chips */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-2.5">Size</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateParam('size', null)}
              className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors ${
                !currentSize
                  ? 'bg-[#D97706] text-[#121212] font-bold'
                  : 'bg-zinc-800 text-[#F4EBD9]/70 hover:bg-zinc-700'
              }`}
            >
              All
            </button>
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => updateParam('size', size)}
                className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors ${
                  currentSize === size
                    ? 'bg-[#D97706] text-[#121212] font-bold'
                    : 'bg-zinc-800 text-[#F4EBD9]/70 hover:bg-zinc-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
