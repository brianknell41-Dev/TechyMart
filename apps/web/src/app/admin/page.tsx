'use client';

import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { formatPrice, formatDate } from '@/lib/utils';

interface Analytics {
  stats: { totalOrders: number; totalRevenue: number; totalCustomers: number; totalProducts: number };
  recentOrders: Array<{ orderNumber: string; total: number; status: string; createdAt: string; guestName?: string }>;
  popularProducts: Array<{ name: string; totalSold: number; revenue: number }>;
}

export default function AdminDashboard() {
  const { token } = useAuthStore();
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.getAnalytics(token)
      .then((d) => setData(d as Analytics))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Analytics Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: DollarSign, color: 'bg-green-500' },
          { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'bg-blue-500' },
          { label: 'Customers', value: stats?.totalCustomers || 0, icon: Users, color: 'bg-purple-500' },
          { label: 'Products', value: stats?.totalProducts || 0, icon: Package, color: 'bg-orange-500' },
        ].map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="h-5 w-5 text-brand-600" /> Recent Orders
          </h2>
          {data?.recentOrders?.length ? (
            <div className="space-y-3">
              {data.recentOrders.map((order) => (
                <div key={order.orderNumber} className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                    <p className="text-xs capitalize text-gray-500">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent orders</p>
          )}
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold">Popular Products</h2>
          {data?.popularProducts?.length ? (
            <div className="space-y-3">
              {data.popularProducts.map((product, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.totalSold} sold</p>
                  </div>
                  <p className="text-sm font-bold text-brand-600">{formatPrice(product.revenue)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No sales data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
