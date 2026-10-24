import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AddToCartButton from '@/components/AddToCartButton';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase
      .from('products') as any)
      .select('*, product_images(*), product_variants(*), categories(name, slug), genres(name, slug)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return [{ slug: 'sample-vinyl' }];
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Product Not Found | The Vinyl Crate' };
  }

  const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.image_url || product.product_images?.[0]?.image_url;

  return {
    title: `${product.title} | The Vinyl Crate`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

async function ProductContent({ slug }: { slug: string }) {
  const product = await getProduct(slug);
  if (!product) notFound();

  const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.image_url || product.product_images?.[0]?.image_url;
  const secondaryImages = product.product_images?.filter((img: any) => img.image_url !== primaryImage) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      <div className="space-y-4">
        <div className="aspect-[4/5] bg-zinc-900 border border-[#F4EBD9]/10 relative">
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={primaryImage} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl text-[#F4EBD9]/10">🎸</div>
          )}
          {product.origin_type && (
            <span className="absolute top-4 left-4 bg-[#D97706] text-[#121212] px-3 py-1 font-black text-sm uppercase tracking-widest">
              {product.origin_type}
            </span>
          )}
        </div>
        {secondaryImages.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {secondaryImages.map((imgObj: any, idx: number) => (
              <div key={idx} className="aspect-square bg-zinc-900 border border-[#F4EBD9]/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgObj.image_url} alt={`${product.title} ${idx + 2}`} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity cursor-pointer" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#F4EBD9]">{product.title}</h1>
        <p className="text-2xl text-[#D97706] font-bold font-mono">{formatIDR(product.base_price)}</p>
        <p className="text-[#F4EBD9]/70">{product.description}</p>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <Suspense fallback={<div className="text-[#F4EBD9]/60 font-mono">Loading product details...</div>}>
        <ProductContent slug={slug} />
      </Suspense>
    </div>
  );
}
