import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

const GENRES = [
  { name: 'Metal', emoji: '🤘', color: 'from-gray-900 to-zinc-800', border: 'border-[#D97706]' },
  { name: 'Punk', emoji: '⚡', color: 'from-zinc-900 to-neutral-800', border: 'border-[#F4EBD9]/30' },
  { name: 'Grunge', emoji: '🎸', color: 'from-stone-900 to-zinc-800', border: 'border-[#D97706]' },
  { name: 'Classic Rock', emoji: '🎵', color: 'from-zinc-800 to-neutral-900', border: 'border-[#F4EBD9]/30' },
];

async function FeaturedProductsGrid() {
  let products: any[] = [];
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase.from('products') as any)
      .select('id, name, slug, base_price, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8);
    if (!error && data) {
      products = data;
    }
  } catch {
    products = [];
  }

  function formatIDR(amount: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-[#F4EBD9]/60 font-mono">
        No vinyl drops in the crate right now. Check back soon.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/shop/${p.slug}`}
          className="group border border-[#F4EBD9]/10 hover:border-[#D97706] transition-colors bg-zinc-900/50 block p-4"
        >
          <div className="aspect-square bg-zinc-800 flex items-center justify-center text-4xl mb-4 text-[#F4EBD9]/20">
            💿
          </div>
          <h3 className="font-[family-name:var(--font-playfair)] text-[#F4EBD9] group-hover:text-[#D97706] transition-colors truncate">
            {p.name}
          </h3>
          <p className="text-[#D97706] font-bold mt-1 font-mono">{formatIDR(p.base_price)}</p>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-[#D97706]/30">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <div className="w-[600px] h-[600px] rounded-full border-[40px] border-[#F4EBD9]" />
          <div className="absolute w-[200px] h-[200px] rounded-full border-[20px] border-[#F4EBD9]" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="text-[#D97706] font-mono text-sm tracking-[0.3em] uppercase mb-6">
            ◦ Est. Since the First Riff ◦
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-black text-[#F4EBD9] leading-tight mb-6">
            Curated Band Merch<br />
            <span className="text-[#D97706]">for the Analog Soul</span>
          </h1>
          <p className="text-[#F4EBD9]/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-[family-name:var(--font-inter)]">
            Vintage-styled merchandise from the bands that shaped generations. Authentic. Raw. Yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-[#D97706] text-[#121212] font-bold py-4 px-10 rounded-none tracking-widest uppercase text-sm hover:bg-[#F4EBD9] transition-colors"
            >
              Browse the Crate
            </Link>
            <Link
              href="/shop"
              className="border border-[#F4EBD9]/40 text-[#F4EBD9] font-bold py-4 px-10 rounded-none tracking-widest uppercase text-sm hover:border-[#D97706] hover:text-[#D97706] transition-colors"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* ── Genre Cards ── */}
      <section className="px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#D97706]/30" />
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#D97706] tracking-wide">
            Shop by Genre
          </h2>
          <div className="h-px flex-1 bg-[#D97706]/30" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GENRES.map((g) => (
            <Link
              key={g.name}
              href={`/shop?genre=${encodeURIComponent(g.name)}`}
              className={`bg-gradient-to-br ${g.color} border ${g.border} p-8 flex flex-col items-center gap-3 group hover:border-[#D97706] transition-all duration-300`}
            >
              <span className="text-4xl">{g.emoji}</span>
              <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#F4EBD9] group-hover:text-[#D97706] transition-colors">
                {g.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="px-6 py-10 pb-20 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#D97706]/30" />
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#D97706] tracking-wide">
            Featured Drops
          </h2>
          <div className="h-px flex-1 bg-[#D97706]/30" />
        </div>

        <Suspense fallback={<div className="text-[#F4EBD9]/60 font-mono text-center py-12">Loading featured drops...</div>}>
          <FeaturedProductsGrid />
        </Suspense>
      </section>
    </div>
  );
}
