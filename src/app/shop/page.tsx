import Link from 'next/link';
import { getProducts } from '@/app/actions/products';

interface SearchParams {
  genre?: string;
  origin?: string;
  search?: string;
  sort?: string;
  page?: string;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const limit = 12;

  const result = await getProducts({
    genre: params?.genre,
    origin: params?.origin,
    search: params?.search,
    page,
    limit,
  });

  const products = result?.data ?? [];
  const total = result?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const genres = ['Metal', 'Punk', 'Grunge', 'Classic Rock'];
  const origins = ['Official', 'Bootleg', 'Vintage Reprint', 'Custom'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* ── Header ── */}
      <div className="mb-10 text-center">
        <p className="text-[#D97706] font-mono text-xs tracking-[0.3em] uppercase mb-2">The Archive</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[#F4EBD9]">
          Browse the Crate
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Filter Bar / Sidebar ── */}
        <aside className="w-full lg:w-64 space-y-6 bg-zinc-900/50 p-6 border border-[#F4EBD9]/10">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#D97706] border-b border-[#F4EBD9]/10 pb-3">
            Filters
          </h2>

          {/* Search */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-2">Search</label>
            <form method="GET" action="/shop">
              <input
                type="text"
                name="search"
                defaultValue={params?.search ?? ''}
                placeholder="Band or shirt..."
                className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-2.5 text-sm focus:border-[#D97706] outline-none"
              />
              {params?.genre && <input type="hidden" name="genre" value={params.genre} />}
              {params?.origin && <input type="hidden" name="origin" value={params.origin} />}
            </form>
          </div>

          {/* Genre Filter */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-2">Genre</label>
            <div className="space-y-1.5">
              <Link
                href={`/shop${params?.origin ? `?origin=${params.origin}` : ''}`}
                className={`block text-sm py-1 px-2 ${!params?.genre ? 'text-[#D97706] font-bold bg-[#D97706]/10' : 'text-[#F4EBD9]/70 hover:text-[#F4EBD9]'}`}
              >
                All Genres
              </Link>
              {genres.map((g) => (
                <Link
                  key={g}
                  href={`/shop?genre=${encodeURIComponent(g)}${params?.origin ? `&origin=${params.origin}` : ''}`}
                  className={`block text-sm py-1 px-2 ${params?.genre === g ? 'text-[#D97706] font-bold bg-[#D97706]/10' : 'text-[#F4EBD9]/70 hover:text-[#F4EBD9]'}`}
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>

          {/* Origin Filter */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-2">Origin</label>
            <div className="space-y-1.5">
              <Link
                href={`/shop${params?.genre ? `?genre=${params.genre}` : ''}`}
                className={`block text-sm py-1 px-2 ${!params?.origin ? 'text-[#D97706] font-bold bg-[#D97706]/10' : 'text-[#F4EBD9]/70 hover:text-[#F4EBD9]'}`}
              >
                All Origins
              </Link>
              {origins.map((o) => (
                <Link
                  key={o}
                  href={`/shop?origin=${encodeURIComponent(o)}${params?.genre ? `&genre=${params.genre}` : ''}`}
                  className={`block text-sm py-1 px-2 ${params?.origin === o ? 'text-[#D97706] font-bold bg-[#D97706]/10' : 'text-[#F4EBD9]/70 hover:text-[#F4EBD9]'}`}
                >
                  {o}
                </Link>
              ))}
            </div>
          </div>

          {/* Clear filters */}
          {(params?.genre || params?.origin || params?.search) && (
            <Link
              href="/shop"
              className="block text-center text-xs text-[#D97706] uppercase tracking-wider pt-2 border-t border-[#F4EBD9]/10 hover:underline"
            >
              Reset All Filters
            </Link>
          )}
        </aside>

        {/* ── Product Grid Section ── */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex justify-between items-center mb-6 bg-zinc-900/50 p-4 border border-[#F4EBD9]/10">
            <p className="text-sm text-[#F4EBD9]/60 font-mono">
              Showing <span className="text-[#F4EBD9] font-bold">{products.length}</span> of {total} results
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#F4EBD9]/60 font-mono uppercase">Sort:</span>
              <div className="flex gap-2">
                <Link
                  href={`/shop?${new URLSearchParams({ ...(params as any), sort: 'newest' }).toString()}`}
                  className={`text-xs px-2.5 py-1 ${!params?.sort || params?.sort === 'newest' ? 'bg-[#D97706] text-[#121212] font-bold' : 'text-[#F4EBD9]/70 hover:text-[#F4EBD9]'}`}
                >
                  Newest
                </Link>
                <Link
                  href={`/shop?${new URLSearchParams({ ...(params as any), sort: 'price-asc' }).toString()}`}
                  className={`text-xs px-2.5 py-1 ${params?.sort === 'price-asc' ? 'bg-[#D97706] text-[#121212] font-bold' : 'text-[#F4EBD9]/70 hover:text-[#F4EBD9]'}`}
                >
                  Price: Low to High
                </Link>
                <Link
                  href={`/shop?${new URLSearchParams({ ...(params as any), sort: 'price-desc' }).toString()}`}
                  className={`text-xs px-2.5 py-1 ${params?.sort === 'price-desc' ? 'bg-[#D97706] text-[#121212] font-bold' : 'text-[#F4EBD9]/70 hover:text-[#F4EBD9]'}`}
                >
                  Price: High to Low
                </Link>
              </div>
            </div>
          </div>

          {/* Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/shop/${p.slug}`}
                  className="group border border-[#F4EBD9]/10 hover:border-[#D97706] transition-colors bg-zinc-900/50"
                >
                  <div className="aspect-square bg-zinc-800 relative overflow-hidden">
                    {p.product_images?.[0]?.image_url || p.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.product_images?.[0]?.image_url || p.images?.[0]}
                        alt={p.title || p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#F4EBD9]/20 text-5xl">
                        🎸
                      </div>
                    )}
                    {p.origin_type && (
                      <span className="absolute top-2 left-2 bg-[#D97706] text-[#121212] text-xs font-bold px-2 py-0.5 uppercase tracking-wider">
                        {p.origin_type}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-[family-name:var(--font-playfair)] text-base font-bold text-[#F4EBD9] line-clamp-1 mb-1">
                      {p.title || p.name}
                    </p>
                    {p.genre?.name && (
                      <p className="text-[#D97706] text-xs font-mono uppercase tracking-wider mb-2">{p.genre.name}</p>
                    )}
                    <p className="text-[#F4EBD9]/80 font-bold text-sm">
                      {formatIDR(p.base_price || p.price || 0)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-zinc-900/30 border border-[#F4EBD9]/10">
              <p className="text-4xl mb-3">📭</p>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#F4EBD9] mb-2">No Records Found</h3>
              <p className="text-[#F4EBD9]/50 text-sm mb-6">Try adjusting your filters or search terms.</p>
              <Link
                href="/shop"
                className="inline-block bg-[#D97706] text-[#121212] font-bold text-xs uppercase tracking-widest px-6 py-3"
              >
                Clear Filters
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const searchParamsObj = new URLSearchParams({ ...(params as any), page: String(pageNum) });
                const isCurrent = pageNum === page;
                return (
                  <Link
                    key={pageNum}
                    href={`/shop?${searchParamsObj.toString()}`}
                    className={`w-10 h-10 flex items-center justify-center text-sm font-bold border ${isCurrent ? 'bg-[#D97706] text-[#121212] border-[#D97706]' : 'border-[#F4EBD9]/20 text-[#F4EBD9] hover:border-[#D97706]'}`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}