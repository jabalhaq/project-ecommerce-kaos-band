import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY ?? '';
    const signaturePayload = `${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`;
    const hash = crypto.createHash('sha512').update(signaturePayload).digest('hex');

    if (hash !== body.signature_key) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const orderId = body.order_id;
    const status = body.transaction_status;

    if (status === 'settlement' || status === 'capture') {
      // Mark order as PAID
      await (supabase.from('orders') as any).update({ status: 'PAID' }).eq('id', orderId);
      // Finalize stock deduction (handled via RPC or dedicated logic if present)
      try {
        await (supabase.rpc as any)('finalize_order_stock', { p_order_id: orderId });
      } catch {}
    } else if (status === 'expire' || status === 'cancel') {
      // Release reserved stock & mark order CANCELLED
      await (supabase.from('orders') as any).update({ status: 'CANCELLED' }).eq('id', orderId);
      try {
        await (supabase.rpc as any)('release_order_stock', { p_order_id: orderId });
      } catch {}
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
