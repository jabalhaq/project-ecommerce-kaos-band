// src/app/actions/products.ts

'use server';

import { createClient } from '@/lib/supabase/server';
import type { ProductWithRelations, GenreRow, CategoryRow } from '@/types/database';

export async function getProducts({ genre, origin, search, page = 1, limit = 20 }: {
  genre?: string;
  origin?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const supabase = await createClient();
    let query = supabase.from('products').select(`*, category:categories(*), genre:genres(*), product_variants(*), product_images(*)`);

    if (genre) query = query.eq('genre.slug', genre);
    if (origin) query = query.eq('origin_type', origin);
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

    const from = (page - 1) * limit;
   const { data, error, count } = await (query as any).range(from, from + limit - 1);
    if (error) throw error;
    return { data: data as ProductWithRelations[], total: count };
  } catch (e: any) {
    console.error('getProducts error:', e);
    return { error: e.message };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select(`*, category:categories(*), genre:genres(*), product_variants(*), product_images(*)`)
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return { product: data as ProductWithRelations };
  } catch (e: any) {
    console.error('getProductBySlug error:', e);
    return { error: e.message };
  }
}

export async function getCategories() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    return { categories: data as CategoryRow[] };
  } catch (e: any) {
    console.error('getCategories error:', e);
    return { error: e.message };
  }
}

export async function getGenres() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('genres').select('*').order('name');
    if (error) throw error;
    return { genres: data as GenreRow[] };
  } catch (e: any) {
    console.error('getGenres error:', e);
    return { error: e.message };
  }
}
