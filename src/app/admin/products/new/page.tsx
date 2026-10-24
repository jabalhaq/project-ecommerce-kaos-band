import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Add New Product | Admin – The Vinyl Crate',
  description: 'Create a new product entry with images, variants, and metadata.',
};

async function NewProductForm() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/');
  }

  const categories = await (supabase.from('categories') as any).select('id, name').order('name');
  const genres = await (supabase.from('genres') as any).select('id, name').order('name');

  return (
    <form action="/admin/products/create" method="POST" encType="multipart/form-data" className="space-y-6 bg-zinc-900/30 p-8 border border-[#F4EBD9]/10">
      {/* Title */}
      <div>
        <label className="block text-sm font-mono uppercase text-[#F4EBD9]/60 mb-1">Title</label>
        <input name="name" required className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-2.5 focus:border-[#D97706] outline-none" />
      </div>
      {/* Slug */}
      <div>
        <label className="block text-sm font-mono uppercase text-[#F4EBD9]/60 mb-1">Slug (auto‑generated if empty)</label>
        <input name="slug" placeholder="optional" className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-2.5 focus:border-[#D97706] outline-none" />
      </div>
      {/* Description */}
      <div>
        <label className="block text-sm font-mono uppercase text-[#F4EBD9]/60 mb-1">Description</label>
        <textarea name="description" rows={4} className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-2.5 focus:border-[#D97706] outline-none" />
      </div>
      {/* Origin Type */}
      <div>
        <label className="block text-sm font-mono uppercase text-[#F4EBD9]/60 mb-1">Origin Type</label>
        <select name="origin_type" className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-2.5 focus:border-[#D97706] outline-none">
          <option value="Official">Official</option>
          <option value="Bootleg">Bootleg</option>
          <option value="Vintage Reprint">Vintage Reprint</option>
          <option value="Custom">Custom</option>
        </select>
      </div>
      {/* Category & Genre */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-mono uppercase text-[#F4EBD9]/60 mb-1">Category</label>
          <select name="category_id" required className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-2.5 focus:border-[#D97706] outline-none">
            {categories.data?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-mono uppercase text-[#F4EBD9]/60 mb-1">Genre</label>
          <select name="genre_id" required className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-2.5 focus:border-[#D97706] outline-none">
            {genres.data?.map((g: any) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Base Price */}
      <div>
        <label className="block text-sm font-mono uppercase text-[#F4EBD9]/60 mb-1">Base Price (IDR)</label>
        <input type="number" name="base_price" required min={0} className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-2.5 focus:border-[#D97706] outline-none" />
      </div>
      {/* Weight */}
      <div>
        <label className="block text-sm font-mono uppercase text-[#F4EBD9]/60 mb-1">Weight (grams)</label>
        <input type="number" name="weight" required min={0} className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-2.5 focus:border-[#D97706] outline-none" />
      </div>
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-mono uppercase text-[#F4EBD9]/60 mb-1">Images (max 5)</label>
        <input type="file" name="images" accept="image/*" multiple className="w-full text-[#F4EBD9]" />
      </div>
      {/* Variants / Stock */}
      <fieldset className="border border-[#F4EBD9]/20 p-4">
        <legend className="text-sm font-mono uppercase text-[#F4EBD9]/60 px-2">Size & Stock</legend>
        <textarea name="variants" rows={4} placeholder='[{"size":"S","stock":10},{"size":"M","stock":15}]' className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-2.5 focus:border-[#D97706] outline-none" />
      </fieldset>
      {/* Submit */}
      <button type="submit" className="w-full bg-[#D97706] text-[#121212] font-bold py-3 mt-4 hover:bg-[#F4EBD9] transition-colors">
        Create Product
      </button>
    </form>
  );
}

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#F4EBD9] mb-6">Create New Product</h1>
      <Suspense fallback={<div className="text-[#F4EBD9]/60 font-mono">Loading form...</div>}>
        <NewProductForm />
      </Suspense>
    </div>
  );
}
