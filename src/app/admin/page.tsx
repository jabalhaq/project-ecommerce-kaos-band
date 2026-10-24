import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import StatsOverview from '@/components/admin/StatsOverview';
import QuickLinks from '@/components/admin/QuickLinks';

export const metadata = {
  title: 'Admin Dashboard | The Vinyl Crate',
  description: 'Administrative overview of sales, inventory, and users.',
};

async function AdminDashboardContent() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#F4EBD9]">Admin Dashboard</h1>
      <StatsOverview />
      <QuickLinks />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-12 text-[#F4EBD9]/60 font-mono">Loading dashboard...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
