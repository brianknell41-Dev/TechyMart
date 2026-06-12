'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { formatDate } from '@/lib/utils';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const { token } = useAuthStore();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (!token) return;
    api.adminGetCustomers(token).then((r) => setCustomers(r.customers as Customer[]));
  }, [token]);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Customers</h1>
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-left font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-600">{c.email}</td>
                <td className="px-4 py-3 text-gray-600">{c.phone || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p className="py-12 text-center text-gray-500">No customers yet</p>}
      </div>
    </div>
  );
}
