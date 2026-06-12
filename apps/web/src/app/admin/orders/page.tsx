'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { formatPrice, formatDate } from '@/lib/utils';

interface AdminOrder {
  _id: string;
  orderNumber: string;
  guestName?: string;
  guestEmail?: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  const load = () => {
    if (!token) return;
    api.adminGetOrders(token).then((r) => setOrders(r.orders as AdminOrder[]));
  };

  useEffect(load, [token]);

  const updateStatus = async (id: string, status: string) => {
    if (!token) return;
    await api.adminUpdateOrder(id, { status }, token);
    load();
  };

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-gray-500">{order.guestName || order.guestEmail || 'Guest'} · {formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm capitalize"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="text-lg font-bold text-brand-600">{formatPrice(order.total)}</span>
              </div>
            </div>
            <div className="mt-4 space-y-1 border-t border-gray-100 pt-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-600">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-xs text-gray-500">
              <span>Payment: {order.paymentMethod.replace('_', ' ')}</span>
              <span>Status: {order.paymentStatus}</span>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-center text-gray-500 py-12">No orders yet</p>}
      </div>
    </div>
  );
}
