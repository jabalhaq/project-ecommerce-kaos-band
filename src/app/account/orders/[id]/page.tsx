import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/client';
import type { Metadata } from 'next';

interface Params {
  id: string;
}

async function getOrder(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, product_variants(products(*, product_images(*))))')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return [{ id: 'order-sample' }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const orderRaw = await getOrder(id);
  const order = orderRaw as any;
  if (!order) {
    return { title: 'Order Not Found | The Vinyl Crate' };
  }
  return {
    title: `Order #${order.id || id} – The Vinyl Crate`,
    description: `Details for order #${order.id || id}`,
  };
}



async function OrderContent({ id }: { id: string }) {
  const orderRaw = await getOrder(id);
  if (!orderRaw) notFound();
  
  const order = orderRaw as any;

  const statusColors: Record<string, string> = {
    PENDING: 'bg-[#D97706]',
    PAID: 'bg-[#F4EBD9]/30 text-[#F4EBD9]',
    SHIPPED: 'bg-[#D97706]',
    COMPLETED: 'bg-[#D97706]',
    CANCELLED: 'bg-[#F4EBD9]/10 text-[#F4EBD9]',
  };

  function formatIDR(amount: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#F4EBD9]">Order #{order.order_number}</h1>
      <div className={`inline-block px-4 py-1 rounded ${statusColors[order.status] ?? 'bg-[#F4EBD9]/10'} text-sm font-medium`}>Status: {order.status}</div>
      <section className="border border-[#F4EBD9]/10 bg-zinc-900/30 p-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#F4EBD9] mb-4">Items</h2>
        <ul className="space-y-4">
          {order.order_items.map((item: any) => {
            const product = item.product_variants?.products;
            const image = product?.product_images?.find((img: any) => img.is_primary)?.image_url || product?.product_images?.[0]?.image_url;
            return (
            <li key={item.id} className="flex items-center gap-4">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={product.title} className="w-16 h-16 object-cover" />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-zinc-800 text-[#F4EBD9]/20">🎸</div>
              )}
              <div className="flex-1">
                <p className="font-[family-name:var(--font-playfair)] text-[#F4EBD9]">{item.product_title}</p>
                <p className="text-xs text-[#F4EBD9]/60">Qty: {item.quantity} | Size: {item.product_size}</p>
              </div>
              <p className="font-bold text-[#D97706]">{formatIDR(item.price_at_purchase * item.quantity)}</p>
            </li>
          )})}
        </ul>
      </section>
      <section className="border border-[#F4EBD9]/10 bg-zinc-900/30 p-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#F4EBD9] mb-4">Summary</h2>
        <div className="flex justify-between text-[#F4EBD9]/80">
          <span>Subtotal</span>
          <span>{formatIDR(order.total_amount - order.shipping_cost)}</span>
        </div>
        <div className="flex justify-between text-[#F4EBD9]/80">
          <span>Shipping</span>
          <span>{formatIDR(order.shipping_cost)}</span>
        </div>
        <div className="flex justify-between font-bold text-[#D97706] mt-2">
          <span>Total</span>
          <span>{formatIDR(order.total_amount)}</span>
        </div>
      </section>
      {order.tracking_number && (
        <section className="border border-[#F4EBD9]/10 bg-zinc-900/30 p-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#F4EBD9] mb-4">Tracking</h2>
          <p className="text-[#F4EBD9]/70">{order.tracking_number}</p>
        </section>
      )}
    </div>
  );
}

export default async function OrderDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-6 py-12 text-[#F4EBD9]/60 font-mono">Loading order...</div>}>
      <OrderContent id={id} />
    </Suspense>
  );
}
