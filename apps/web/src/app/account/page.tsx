'use client';

import Link from 'next/link';
import { Package, Heart, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function AccountDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <div className="card p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Welcome back, {user?.name?.split(' ')[0]}!</h2>
        <p className="mt-2 text-gray-600">Manage your orders, wishlist, and account settings.</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { href: '/account/orders', icon: Package, label: 'My Orders', desc: 'Track and view orders' },
          { href: '/account/wishlist', icon: Heart, label: 'Wishlist', desc: 'Saved products' },
          { href: '/account/addresses', icon: MapPin, label: 'Addresses', desc: 'Shipping addresses' },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="card p-6 transition-shadow hover:shadow-md">
            <item.icon className="mb-3 h-8 w-8 text-brand-600" />
            <h3 className="font-semibold text-gray-900">{item.label}</h3>
            <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
