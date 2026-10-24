'use client';

import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { formatIDR } from '@/lib/utils';

export default function ShippingOptions() {
  const [selectedCourier, setSelectedCourier] = useState('jne-reg');

  const couriers = [
    { id: 'jne-reg', name: 'JNE Regular', service: 'REG', estimate: '2-3 Days', price: 20000 },
    { id: 'jnt-ez', name: 'J&T Express', service: 'EZ', estimate: '2-3 Days', price: 22000 },
    { id: 'sicepat-reg', name: 'SiCepat REG', service: 'REG', estimate: '1-2 Days', price: 25000 },
  ];

  return (
    <div className="bg-zinc-900 border border-[#F4EBD9]/10 p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-[#F4EBD9]/10 pb-4">
        <Truck className="h-5 w-5 text-[#D97706]" />
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#F4EBD9]">
          Shipping Courier
        </h2>
      </div>

      <div className="space-y-3">
        {couriers.map((courier) => (
          <label
            key={courier.id}
            onClick={() => setSelectedCourier(courier.id)}
            className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
              selectedCourier === courier.id
                ? 'border-[#D97706] bg-[#D97706]/10'
                : 'border-[#F4EBD9]/10 bg-[#121212] hover:border-[#F4EBD9]/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="courier"
                checked={selectedCourier === courier.id}
                onChange={() => setSelectedCourier(courier.id)}
                className="accent-[#D97706]"
              />
              <div>
                <p className="text-sm font-bold text-[#F4EBD9]">{courier.name}</p>
                <p className="text-xs text-[#F4EBD9]/60 font-mono">Estimated delivery: {courier.estimate}</p>
              </div>
            </div>
            <span className="text-sm font-bold font-mono text-[#D97706]">
              {formatIDR(courier.price)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
