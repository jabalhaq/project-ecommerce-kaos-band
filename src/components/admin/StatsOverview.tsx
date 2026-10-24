'use client';

import React from 'react';

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-[#1A1A1A] p-4 rounded border border-[#F4EBD9]/10">
        <h3 className="text-[#F4EBD9]/60">Total Orders</h3>
        <p className="text-2xl font-bold">0</p>
      </div>
      <div className="bg-[#1A1A1A] p-4 rounded border border-[#F4EBD9]/10">
        <h3 className="text-[#F4EBD9]/60">Pending</h3>
        <p className="text-2xl font-bold">0</p>
      </div>
      <div className="bg-[#1A1A1A] p-4 rounded border border-[#F4EBD9]/10">
        <h3 className="text-[#F4EBD9]/60">Revenue</h3>
        <p className="text-2xl font-bold">IDR 0</p>
      </div>
    </div>
  );
}
