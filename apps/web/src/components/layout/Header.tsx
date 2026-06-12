'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, ShoppingCart, User, Heart, Search, ChevronDown,
  Zap, LogOut, LayoutDashboard,
} from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/products', label: 'Shop' },
  { href: '/products?category=electronics', label: 'Electronics' },
  { href: '/products?category=solar-solutions', label: 'Solar' },
  { href: '/products?category=kitchen-appliances', label: 'Kitchen' },
  { href: '/products?flashDeal=true', label: 'Deals' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled ? 'bg-white/95 shadow-sm backdrop-blur-md' : 'bg-white'
        )}
      >
        {/* Top bar */}
        <div className="hidden border-b border-gray-100 bg-brand-950 py-2 text-center text-xs text-white sm:block">
          <p>
            Free shipping on orders over ₦50,000 &nbsp;|&nbsp; Use code <strong>TECHY10</strong> for 10% off
          </p>
        </div>

        <div className="container-main">
          <div className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                Techy<span className="text-brand-600">Mart</span>
              </span>
            </Link>

            {/* Desktop search */}
            <div className="hidden flex-1 max-w-xl lg:block">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="rounded-xl p-2.5 text-gray-700 hover:bg-gray-100 lg:hidden"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl">
                        <Link href="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">
                          <User className="h-4 w-4" /> My Account
                        </Link>
                        <Link href="/account/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">
                          Orders
                        </Link>
                        <Link href="/account/wishlist" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">
                          <Heart className="h-4 w-4" /> Wishlist
                        </Link>
                        {user.role === 'admin' && (
                          <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">
                            <LayoutDashboard className="h-4 w-4" /> Admin Panel
                          </Link>
                        )}
                        <hr className="my-2" />
                        <button
                          onClick={logout}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/login" className="hidden sm:flex btn-ghost">
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline">Sign In</span>
                </Link>
              )}

              <Link href="/account/wishlist" className="hidden sm:flex btn-ghost relative" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </Link>

              <Link href="/cart" className="btn-ghost relative" aria-label={`Cart, ${itemCount} items`}>
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden border-t border-gray-100 lg:block" aria-label="Main navigation">
            <ul className="flex items-center gap-1 py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-brand-50 hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-white p-4 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchBar onClose={() => setSearchOpen(false)} />
            </div>
            <button onClick={() => setSearchOpen(false)} className="rounded-xl p-2 hover:bg-gray-100" aria-label="Close search">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold">TechyMart</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="rounded-xl p-2 hover:bg-gray-100" aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-4" />
              {user ? (
                <>
                  <Link href="/account" className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-gray-50">My Account</Link>
                  <Link href="/account/orders" className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-gray-50">Orders</Link>
                  <Link href="/account/wishlist" className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-gray-50">Wishlist</Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="block rounded-xl px-4 py-3 text-base font-medium text-brand-600 hover:bg-brand-50">Admin Panel</Link>
                  )}
                  <button onClick={logout} className="mt-2 block w-full rounded-xl px-4 py-3 text-left text-base font-medium text-red-600 hover:bg-red-50">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-gray-50">Sign In</Link>
                  <Link href="/register" className="mt-2 block rounded-xl bg-brand-600 px-4 py-3 text-center text-base font-semibold text-white">
                    Create Account
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Sticky mobile cart button */}
      {itemCount > 0 && (
        <Link
          href="/cart"
          className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 sm:hidden"
          aria-label={`View cart, ${itemCount} items`}
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold">
            {itemCount}
          </span>
        </Link>
      )}
    </>
  );
}
