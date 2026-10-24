import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AddressForm from '@/components/checkout/AddressForm';
import ShippingOptions from '@/components/checkout/ShippingOptions';
import OrderSummary from '@/components/checkout/OrderSummary';

export const metadata = {
  title: 'Checkout | The Vinyl Crate',
  description: 'Complete your purchase with secure payment.',
};

async function CheckoutContent() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/#auth');
  }

  const { data: cart } = await (supabase.from('carts') as any).select('*, products(*)').eq('user_id', session.user.id);
  const items = cart ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <AddressForm />
        <ShippingOptions />
      </div>
      <OrderSummary items={items} />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#F4EBD9] text-center">
        Checkout
      </h1>
      <Suspense fallback={<div className="text-[#F4EBD9]/60 font-mono text-center py-12">Loading checkout...</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
