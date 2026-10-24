'use client';

import Link from 'next/link';

export default function QuickLinks() {
  return (
    <div className="flex gap-4">
      <Link href="/admin/products/new" className="bg-[#D97706] text-white px-4 py-2 rounded">
        Add Product
      </Link>
    </div>
  );
}
