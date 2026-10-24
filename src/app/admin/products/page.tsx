import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import AddProductButton from '@/components/admin/AddProductButton';

export const metadata = {
  title: 'Products | Admin – The Vinyl Crate',
  description: 'Manage product catalogue: edit, delete, stock.',
};

async function ProductsTable() {
  const supabase = await createClient();
  const { data, error } = await (supabase.from('products') as any).select('id, name, slug, base_price, stock, is_active').order('created_at', { ascending: false });
  if (error) throw error;
  const products = data ?? [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-[#F4EBD9]/10">
        <thead className="bg-zinc-900/40 text-[#F4EBD9]">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">SKU</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F4EBD9]/10">
          {products.map((p: any) => (
            <tr key={p.id} className="hover:bg-zinc-900/30">
              <td className="p-3">
                <Link href={`/admin/products/${p.id}`} className="text-[#F4EBD9] hover:underline">{p.name}</Link>
              </td>
              <td className="p-3 text-sm text-[#F4EBD9]/70">{p.id.slice(0, 8)}</td>
              <td className="p-3 text-[#D97706] font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p.base_price)}</td>
              <td className="p-3 text-[#F4EBD9]/70">{p.stock ?? '—'}</td>
              <td className="p-3">
                {p.is_active ? (
                  <span className="text-[#D97706] font-mono text-xs uppercase">Active</span>
                ) : (
                  <span className="text-[#F4EBD9]/50 font-mono text-xs uppercase">Inactive</span>
                )}
              </td>
              <td className="p-3 text-right space-x-2">
                <Link href={`/admin/products/${p.id}/edit`} className="text-[#D97706] hover:underline">Edit</Link>
                <Link href={`/admin/products/${p.id}/delete`} className="text-[#F4EBD9]/50 hover:underline">Delete</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#F4EBD9]">Product Management</h1>
        <AddProductButton />
      </div>
      <Suspense fallback={<div className="text-[#F4EBD9]/60 font-mono">Loading products...</div>}>
        <ProductsTable />
      </Suspense>
    </div>
  );
}
