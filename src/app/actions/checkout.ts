// src/app/actions/checkout.ts

'use server';

import { createClient } from '@/lib/supabase/server';
import type { CartItem } from '@/stores/cart-store';
import type { OrderItemInsert } from '@/types/database';

/** Validate cart items against stock */
export async function validateCart(items: CartItem[]) {
  try {
    const supabase = await createClient();
    const variantIds = items.map((i) => i.variantId);
    const { data: variants, error } = await (supabase
      .from('product_variants') as any)
      .select('id, stock_quantity')
      .in('id', variantIds);
    if (error) throw error;
    const stockMap = new Map<string, number>(variants?.map((v: any) => [v.id, v.stock_quantity]));
    for (const item of items) {
      const stock = stockMap.get(item.variantId) ?? 0;
      if (stock < item.quantity) {
        return { valid: false, message: `Insufficient stock for ${item.title} (${item.size})` };
      }
    }
    return { valid: true };
  } catch (e: any) {
    console.error('validateCart error:', e);
    return { valid: false, error: e.message };
  }
}

/** Calculate shipping using Biteship API */
export async function calculateShipping({ origin, destination, weight }: { origin: string; destination: string; weight: number }) {
  try {
    const response = await fetch('https://api.biteship.com/v1/rates/couriers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.BITESHIP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin_postal_code: origin,
        destination_postal_code: destination,
        items: [{ name: 'Shirts', weight }],
        couriers: 'jne,jnt,sicepat',
      }),
    });
    if (!response.ok) throw new Error(`Biteship HTTP ${response.status}`);
    const data = await response.json();
    return { options: data.pricing ?? [] };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('calculateShipping error:', msg);
    return { error: msg };
  }
}

/** Create order and reserve stock */
export async function createOrder({
  userId,
  items,
  shippingInfo,
}: {
  userId: string;
  items: CartItem[];
  shippingInfo: {
    courier: string;
    service: string;
    cost: number;
  };
}) {
  try {
    const supabase = await createClient();

    const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const totalAmount = subtotal + shippingInfo.cost;

    // 1. Insert order row
    const { data: order, error: orderErr } = await (supabase
      .from('orders') as any)
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        shipping_cost: shippingInfo.cost,
        shipping_courier: shippingInfo.courier,
        shipping_service: shippingInfo.service,
        status: 'PENDING_PAYMENT',
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      })
      .select('*')
      .single();
    if (orderErr) throw orderErr;

    // 2. Insert order items
    const orderItems: OrderItemInsert[] = items.map((it) => ({
      order_id: order.id,
      variant_id: it.variantId,
      product_title: it.title,
      product_size: it.size as any,
      price_at_purchase: it.price,
      quantity: it.quantity,
    }));
    const { error: itemsErr } = await (supabase.from('order_items') as any).insert(orderItems);
    if (itemsErr) throw itemsErr;

    // 3. Reserve stock: read-then-decrement each variant
    for (const it of items) {
      const { data: variant } = await (supabase
        .from('product_variants') as any)
        .select('stock_quantity')
        .eq('id', it.variantId)
        .single();
      if (variant) {
        await (supabase.from('product_variants') as any)
          .update({ stock_quantity: variant.stock_quantity - it.quantity })
          .eq('id', it.variantId);
      }
    }

    return { order };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('createOrder error:', msg);
    return { error: msg };
  }
}

/** Release reserved stock (on payment expiry / cancellation) */
export async function releaseStockReservation(orderId: string) {
  try {
    const supabase = await createClient();

    const { data: orderItems, error } = await (supabase
      .from('order_items') as any)
      .select('variant_id, quantity')
      .eq('order_id', orderId);
    if (error) throw error;

    for (const item of orderItems ?? []) {
      const { data: variant } = await (supabase
        .from('product_variants') as any)
        .select('stock_quantity')
        .eq('id', item.variant_id)
        .single();
      if (variant) {
        await (supabase.from('product_variants') as any)
          .update({ stock_quantity: variant.stock_quantity + item.quantity })
          .eq('id', item.variant_id);
      }
    }

    await (supabase.from('orders') as any)
      .update({ status: 'CANCELLED' })
      .eq('id', orderId);

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('releaseStockReservation error:', msg);
    return { error: msg };
  }
}

/** Get Midtrans Snap token */
export async function getMidtransToken({ orderId, amount }: { orderId: string; amount: number }) {
  try {
    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
    };
    const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Midtrans error ${response.status}`);
    const data = await response.json();
    return { token: data.token };
  } catch (e: any) {
    console.error('getMidtransToken error:', e);
    return { error: e.message };
  }
}
