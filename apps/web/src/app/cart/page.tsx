'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, Bookmark, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice, cn } from '@/lib/utils';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function CartPage() {
  const { items, savedForLater, couponCode, couponDiscount, removeItem, updateQuantity, saveForLater, moveToCart, setCoupon, getSubtotal, getTotal } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 50000 || subtotal === 0 ? 0 : 2500;
  const total = getTotal();

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await api.validateCoupon(couponInput.trim(), subtotal);
      if (res.valid) {
        setCoupon(couponInput.trim().toUpperCase(), res.discount);
      }
    } catch {
      setCouponError('Invalid coupon code');
      setCoupon(null, 0);
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="container-main flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <ShoppingBag className="mb-6 h-16 w-16 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products" className="btn-primary mt-8">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-main py-8 sm:py-12">
      <h1 className="section-title mb-8">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="card flex gap-4 p-4 sm:gap-6 sm:p-6">
              <Link href={`/products/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link href={`/products/${item.slug}`} className="font-semibold text-gray-900 hover:text-brand-600 line-clamp-2">
                  {item.name}
                </Link>
                <p className="mt-1 text-lg font-bold text-brand-600">{formatPrice(item.price)}</p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                  <div className="flex items-center rounded-lg border border-gray-200">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center hover:bg-gray-50" aria-label="Decrease">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center hover:bg-gray-50" aria-label="Increase">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button onClick={() => saveForLater(item.productId)} className="btn-ghost text-xs">
                    <Bookmark className="h-4 w-4" /> Save
                  </button>
                  <button onClick={() => removeItem(item.productId)} className="btn-ghost text-xs text-red-500">
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
              <p className="hidden text-right font-bold text-gray-900 sm:block">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}

          {savedForLater.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-semibold">Saved for Later</h2>
              {savedForLater.map((item) => (
                <div key={item.productId} className="card mb-3 flex items-center gap-4 p-4 opacity-75">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm font-bold text-brand-600">{formatPrice(item.price)}</p>
                  </div>
                  <button onClick={() => moveToCart(item.productId)} className="btn-secondary py-2 text-xs">Move to Cart</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold">Order Summary</h2>

            <div className="mb-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Tag className="h-4 w-4" /> Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. TECHY10"
                  className="input-field py-2"
                />
                <button onClick={applyCoupon} disabled={couponLoading} className="btn-primary shrink-0 px-4 py-2">
                  Apply
                </button>
              </div>
              {couponError && <p className="mt-1 text-xs text-red-500">{couponError}</p>}
              {couponCode && <p className="mt-1 text-xs text-green-600">Coupon {couponCode} applied!</p>}
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(couponDiscount)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-lg font-bold">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary mt-6 w-full">Proceed to Checkout</Link>
            <Link href="/products" className="mt-3 block text-center text-sm font-medium text-brand-600 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
