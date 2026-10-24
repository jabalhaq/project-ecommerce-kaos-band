'use client';

import React, { useState } from 'react';
import { updateOrderTracking } from '@/app/actions/admin';
import { updateOrderStatus } from '@/app/actions/orders';
import { Button } from '@/components/ui/Button';

interface OrderActionsProps {
  order: {
    id: string;
    status: string;
    tracking_number?: string | null;
  };
}

export default function OrderActions({ order }: OrderActionsProps) {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (status !== order.status) {
        await updateOrderStatus(order.id, status as any);
      }
      if (trackingNumber !== order.tracking_number) {
        await updateOrderTracking(order.id, trackingNumber);
      }
      alert('Order updated successfully');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-1.5 text-xs outline-none"
      >
        <option value="PENDING_PAYMENT">Pending Payment</option>
        <option value="PAID">Paid</option>
        <option value="PROCESSING">Processing</option>
        <option value="SHIPPED">Shipped</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      <input
        type="text"
        placeholder="Tracking #"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        className="w-28 bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-1.5 text-xs outline-none font-mono"
      />

      <Button size="sm" isLoading={loading} onClick={handleUpdate}>
        Save
      </Button>
    </div>
  );
}
