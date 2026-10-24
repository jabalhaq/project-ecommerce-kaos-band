import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Jika belum login, arahkan ke halaman utama / login modal
  if (!user) {
    redirect('/');
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#F4EBD9]">
        My Account
      </h1>
      
      <div className="border border-[#F4EBD9]/10 bg-zinc-900/30 p-6 rounded space-y-3">
        <p className="text-[#F4EBD9]/80">Email: <span className="text-white font-medium">{user.email}</span></p>
        <div className="pt-2">
          <Link 
            href="/account/orders" 
            className="inline-block bg-[#D97706] text-black font-semibold px-4 py-2 rounded hover:bg-[#b86405] transition"
          >
            Lihat Riwayat Pesanan
          </Link>
        </div>
      </div>
    </div>
  );
}