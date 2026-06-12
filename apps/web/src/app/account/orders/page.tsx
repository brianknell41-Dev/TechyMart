'use client';

import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Order } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.getOrders(token)
      .then((r) => setOrders(r.orders as Order[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="skeleton h-64 rounded-2xl" />;

  if (orders.length === 0) {
    return (
      <div className="card flex flex-col items-center py-16 text-center">
        <Package className="mb-4 h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-semibold">No orders yet</h2>
        <p className="mt-2 text-sm text-gray-500">Start shopping to see your orders here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Order History</h2>
      {orders.map((order) => (
        <div key={order._id} className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900">{order.orderNumber}</p>
              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
              {order.status}
            </span>
          </div>
          <div className="mt-4 space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} x{item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 font-bold">
            <span>Total</span>
            <span className="text-brand-600">{formatPrice(order.total)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
