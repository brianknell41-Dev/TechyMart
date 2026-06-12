'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/account', label: 'Dashboard', icon: User },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/settings', label: 'Settings', icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="container-main py-8 sm:py-12">
      <h1 className="section-title mb-8">My Account</h1>
      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <nav className="card overflow-hidden">
            <div className="border-b border-gray-100 p-4">
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600"
                  >
                    <item.icon className="h-4 w-4" /> {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button onClick={() => { logout(); router.push('/'); }} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
