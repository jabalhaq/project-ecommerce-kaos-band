import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function AddProductButton() {
  return (
    <Link
      href="/admin/products/new"
      className="bg-[#D97706] text-[#121212] px-4 py-2.5 font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-[#F4EBD9] transition-colors"
    >
      <Plus className="h-4 w-4" /> Add Product
    </Link>
  );
}
