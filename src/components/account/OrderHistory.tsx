'use client';

import React from 'react';

export default function OrderHistory({ userId }: { userId?: string }) {
  return (
    <div className="bg-[#1A1A1A] border border-[#F4EBD9]/10 rounded-lg p-6 text-[#F4EBD9]">
      <h2 className="text-xl font-serif mb-4">Order History</h2>
      <p className="text-sm text-[#F4EBD9]/60">You have no past orders yet.</p>
    </div>
  );
}
