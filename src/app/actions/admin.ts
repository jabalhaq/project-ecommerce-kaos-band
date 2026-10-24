// src/app/actions/admin.ts

'use server';

import { createClient } from '@/lib/supabase/server';
import type {
  ProductInsert,
  ProductUpdate,
  ProductImageInsert,
  ProductVariantInsert,
  ShirtSize,
} from '@/types/database';

// ── Guard helper ─────────────────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Not authenticated');

  const { data: profile } = await (supabase
    .from('profiles') as any)
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') throw new Error('Forbidden: admins only');
  return supabase;
}

// ── Products ──────────────────────────────────────────────────────────────────

export interface CreateProductInput {
  title: string;
  slug: string;
  description?: string;
  category_id?: string;
  genre_id?: string;
  origin_type: 'IMPORT' | 'IN_HOUSE';
  base_price: number;
  weight_grams?: number;
  is_active?: boolean;
  variants?: { size: ShirtSize; sku?: string; stock_quantity: number }[];
  images?: { url: string; is_primary?: boolean; display_order?: number }[];
}

export async function createProduct(input: CreateProductInput) {
  try {
    const supabase = await requireAdmin();

    const { variants, images, ...productFields } = input;

    const payload: ProductInsert = {
      ...productFields,
      description: productFields.description || null,
      category_id: productFields.category_id || null,
      genre_id: productFields.genre_id || null,
      weight_grams: productFields.weight_grams ?? 220,
      is_active: productFields.is_active ?? true,
    };

    const { data: product, error: productErr } = await (supabase
      .from('products') as any)
      .insert(payload)
      .select('*')
      .single();
    if (productErr) throw productErr;

    // Insert variants
    if (variants?.length) {
      const variantRows: ProductVariantInsert[] = variants.map((v) => ({
        product_id: product.id,
        size: v.size,
        sku: v.sku || null,
        stock_quantity: v.stock_quantity,
      }));
      const { error: varErr } = await (supabase.from('product_variants') as any).insert(variantRows);
      if (varErr) throw varErr;
    }

    // Insert images
    if (images?.length) {
      const imageRows: ProductImageInsert[] = images.map((img, i) => ({
        product_id: product.id,
        image_url: img.url,
        is_primary: img.is_primary ?? i === 0,
        display_order: img.display_order ?? i,
      }));
      const { error: imgErr } = await (supabase.from('product_images') as any).insert(imageRows);
      if (imgErr) throw imgErr;
    }

    return { product };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('createProduct error:', msg);
    return { error: msg };
  }
}

export async function updateProduct(productId: string, update: ProductUpdate) {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await (supabase
      .from('products') as any)
      .update(update)
      .eq('id', productId)
      .select('*')
      .single();
    if (error) throw error;
    return { product: data };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('updateProduct error:', msg);
    return { error: msg };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const supabase = await requireAdmin();
    const { error } = await (supabase.from('products') as any).delete().eq('id', productId);
    if (error) throw error;
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('deleteProduct error:', msg);
    return { error: msg };
  }
}

// ── Variants ──────────────────────────────────────────────────────────────────

export async function updateVariantStock(variantId: string, stock_quantity: number) {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await (supabase
      .from('product_variants') as any)
      .update({ stock_quantity })
      .eq('id', variantId)
      .select('*')
      .single();
    if (error) throw error;
    return { variant: data };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('updateVariantStock error:', msg);
    return { error: msg };
  }
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function updateOrderTracking(
  orderId: string,
  trackingNumber: string,
  courierName?: string
) {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await (supabase
      .from('orders') as any)
      .update({
        tracking_number: trackingNumber,
        status: 'SHIPPED',
        ...(courierName ? { shipping_courier: courierName } : {}),
      })
      .eq('id', orderId)
      .select('*')
      .single();
    if (error) throw error;
    return { order: data };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('updateOrderTracking error:', msg);
    return { error: msg };
  }
}

// ── Image Upload to Supabase Storage ─────────────────────────────────────────

export async function uploadProductImage(
  productId: string,
  fileBase64: string,
  fileName: string,
  mimeType: string
) {
  try {
    const supabase = await requireAdmin();

    const buffer = Buffer.from(fileBase64, 'base64');
    const storagePath = `${productId}/${Date.now()}-${fileName}`;

    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('product-media')
      .upload(storagePath, buffer, { contentType: mimeType, upsert: false });
    if (uploadErr) throw uploadErr;

    const { data: { publicUrl } } = supabase.storage
      .from('product-media')
      .getPublicUrl(uploadData.path);

    return { url: publicUrl, path: uploadData.path };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('uploadProductImage error:', msg);
    return { error: msg };
  }
}

export async function deleteProductImage(storagePath: string, imageId: string) {
  try {
    const supabase = await requireAdmin();

    const { error: storageErr } = await supabase.storage
      .from('product-media')
      .remove([storagePath]);
    if (storageErr) throw storageErr;

    const { error: dbErr } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId);
    if (dbErr) throw dbErr;

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('deleteProductImage error:', msg);
    return { error: msg };
  }
}
