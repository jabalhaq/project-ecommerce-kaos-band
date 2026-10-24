import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import OrderActions from '@/components/admin/OrderActions';

export const metadata = {
  title: 'Orders | Admin – The Vinyl Crate',
  description: 'Manage and update customer orders, tracking, and status.',
};

async function OrdersTable() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('orders').select('*, profiles(email)').order('created_at', { ascending: false });
  if (error) throw error;
  const orders = data ?? [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-[#F4EBD9]/10">
        <thead className="bg-zinc-900/40 text-[#F4EBD9]">
          <tr>
            <th className="p-3 text-left">Order ID</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Tracking #</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F4EBD9]/10">
          {orders.map((o: any) => (
            <tr key={o.id} className="hover:bg-zinc-900/30">
              <td className="p-3 font-mono text-sm">{o.id.slice(0, 8)}</td>
              <td className="p-3">{o.profiles?.email ?? 'Guest'}</td>
              <td className="p-3">
                <span className="font-bold text-xs uppercase px-2 py-1 rounded bg-[#D97706]/10 text-[#D97706]">{o.status}</span>
              </td>
              <td className="p-3 text-[#D97706] font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(o.total)}</td>
              <td className="p-3 font-mono text-sm">{o.tracking_number ?? '—'}</td>
              <td className="p-3 text-right">
                <OrderActions order={o} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#F4EBD9]">Orders Management</h1>
      <Suspense fallback={<div className="text-[#F4EBD9]/60 font-mono">Loading orders...</div>}>
        <OrdersTable />
      </Suspense>
    </div>
  );
}
