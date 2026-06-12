import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function getDiscount(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function getWhatsAppOrderUrl(items: { name: string; quantity: number; price: number }[], total: number): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348000000000';
  const lines = items.map((i) => `• ${i.name} x${i.quantity} - ${formatPrice(i.price * i.quantity)}`);
  const message = encodeURIComponent(
    `Hi TechyMart! I'd like to place an order:\n\n${lines.join('\n')}\n\nTotal: ${formatPrice(total)}\n\nPlease confirm availability and payment details.`
  );
  return `https://wa.me/${number}?text=${message}`;
}
