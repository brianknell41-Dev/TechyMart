'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingCart, Users, FolderOpen, LogOut, Zap,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Analytics', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) router.push('/login');
    else if (user.role !== 'admin') router.push('/');
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="fixed inset-0 z-[100] min-h-screen overflow-auto bg-gray-50">
      <div className="flex">
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-gray-200 bg-white lg:block">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">Admin Panel</span>
          </div>
          <nav className="p-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  pathname === item.href ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            ))}
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </nav>
        </aside>

        <main className="flex-1 lg:ml-64">
          <div className="border-b bg-white px-6 py-4 lg:hidden">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'shrink-0 rounded-lg px-3 py-2 text-xs font-medium',
                    pathname === item.href ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
