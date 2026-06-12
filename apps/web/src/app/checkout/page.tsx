'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Smartphone, Truck, MessageCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import { formatPrice, getWhatsAppOrderUrl, cn } from '@/lib/utils';
import type { PaymentMethod } from '@/types';

const PAYMENT_METHODS = [
  { id: 'bank_transfer' as PaymentMethod, label: 'Bank Transfer', icon: CreditCard, desc: 'Pay via bank transfer' },
  { id: 'mobile_payment' as PaymentMethod, label: 'Mobile Payment', icon: Smartphone, desc: 'Pay with mobile money' },
  { id: 'pay_on_delivery' as PaymentMethod, label: 'Pay on Delivery', icon: Truck, desc: 'Pay when you receive' },
  { id: 'whatsapp' as PaymentMethod, label: 'WhatsApp Order', icon: MessageCircle, desc: 'Complete via WhatsApp' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, couponCode, couponDiscount, getSubtotal, getTotal, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pay_on_delivery');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  });

  const subtotal = getSubtotal();
  const shipping = subtotal >= 50000 ? 0 : 2500;
  const total = getTotal();

  if (items.length === 0 && !success) {
    return (
      <div className="container-main py-16 text-center">
        <h1 className="text-2xl font-bold">No items to checkout</h1>
        <Link href="/products" className="btn-primary mt-6">Go Shopping</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (paymentMethod === 'whatsapp') {
      const url = getWhatsAppOrderUrl(
        items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        total
      );
      window.open(url, '_blank');
      setLoading(false);
      return;
    }

    try {
      const res = await api.createOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        guestName: form.name || undefined,
        guestEmail: form.email || undefined,
        guestPhone: form.phone || undefined,
        shippingAddress: form.street ? {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
        } : undefined,
        paymentMethod,
        couponCode: couponCode || undefined,
        notes: form.notes || undefined,
      }, token || undefined);

      const order = res.order as { orderNumber: string };
      setOrderNumber(order.orderNumber);
      clearCart();
      setSuccess(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container-main flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="mb-6 h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h1>
        <p className="mt-2 text-gray-600">Order number: <strong>{orderNumber}</strong></p>
        <p className="mt-4 max-w-md text-sm text-gray-500">
          We&apos;ll send you a confirmation. Thank you for shopping with TechyMart!
        </p>
        <div className="mt-8 flex gap-4">
          <Link href={`/account/orders`} className="btn-primary">View Orders</Link>
          <Link href="/products" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-8 sm:py-12">
      <h1 className="section-title mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Customer info */}
            <section className="card p-6">
              <h2 className="mb-4 text-lg font-semibold">Customer Information <span className="text-sm font-normal text-gray-500">(optional)</span></h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium">Full Name</label>
                  <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
                  <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium">Phone</label>
                  <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section className="card p-6">
              <h2 className="mb-4 text-lg font-semibold">Shipping Address <span className="text-sm font-normal text-gray-500">(optional)</span></h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="street" className="mb-1 block text-sm font-medium">Street Address</label>
                  <input id="street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label htmlFor="city" className="mb-1 block text-sm font-medium">City</label>
                  <input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label htmlFor="state" className="mb-1 block text-sm font-medium">State</label>
                  <input id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field" />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="card p-6">
              <h2 className="mb-4 text-lg font-semibold">Payment Method</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors',
                      paymentMethod === method.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <method.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-28 rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              <div className="max-h-60 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600 line-clamp-1 flex-1 mr-2">{item.name} x{item.quantity}</span>
                    <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(couponDiscount)}</span></div>}
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between text-lg font-bold pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : paymentMethod === 'whatsapp' ? 'Order via WhatsApp' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
