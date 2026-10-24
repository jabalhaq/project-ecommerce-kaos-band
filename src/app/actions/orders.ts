// src/app/actions/orders.ts

'use server';

import { createClient } from '@/lib/supabase/server';
import type { OrderStatus, OrderWithItems } from '@/types/database';

// ── Get all orders for the logged-in user ────────────────────────────────────

export async function getUserOrders() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('orders') as any)
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;

    return { orders: data as OrderWithItems[] };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('getUserOrders error:', msg);
    return { error: msg };
  }
}

// ── Get a single order by ID (user must own it, or be admin) ─────────────────

export async function getOrderById(orderId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('orders') as any)
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();
    if (error) throw error;

    // Enforce ownership unless admin (RLS will block it, but double-check)
    if (data.user_id !== user.id) {
      const { data: profile } = await (supabase
        .from('profiles') as any)
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile?.role !== 'admin') throw new Error('Forbidden');
    }

    return { order: data as OrderWithItems };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('getOrderById error:', msg);
    return { error: msg };
  }
}

// ── Admin: update order status ────────────────────────────────────────────────

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) throw new Error('Not authenticated');

    const { data: profile } = await (supabase
      .from('profiles') as any)
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin') throw new Error('Forbidden: admins only');

    const { data, error } = await (supabase
      .from('orders') as any)
      .update({ status })
      .eq('id', orderId)
      .select('*')
      .single();
    if (error) throw error;

    return { order: data };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('updateOrderStatus error:', msg);
    return { error: msg };
  }
}
