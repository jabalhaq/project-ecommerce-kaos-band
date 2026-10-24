// src/app/actions/auth.ts

'use server';

import { createClient } from '@/lib/supabase/server';
import type { User } from '@/types/database';

export async function signInWithEmail(email: string, password: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Optionally fetch user profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user?.id).single();
    return { user: profile as User | null };
  } catch (e: any) {
    console.error('signInWithEmail error:', e);
    return { error: e.message };
  }
}

export async function signUpWithEmail(email: string, password: string, name?: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) throw error;
    // Create profile row if needed
    if (data.user) {
      await (supabase.from('profiles') as any).insert({ id: data.user.id, full_name: name ?? null, role: 'customer' });
    }
    return { user: data.user };
  } catch (e: any) {
    console.error('signUpWithEmail error:', e);
    return { error: e.message };
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error('signOut error:', e);
    return { error: e.message };
  }
}

export async function signInWithGoogle() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw error;
    return { url: data.url };
  } catch (e: any) {
    console.error('signInWithGoogle error:', e);
    return { error: e.message };
  }
}
