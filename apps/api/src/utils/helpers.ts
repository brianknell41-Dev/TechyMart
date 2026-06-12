export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TM-${timestamp}-${random}`;
}

export function calculateDiscount(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export const COUPONS: Record<string, { discount: number; type: 'percent' | 'fixed' }> = {
  TECHY10: { discount: 10, type: 'percent' },
  WELCOME15: { discount: 15, type: 'percent' },
  SAVE500: { discount: 500, type: 'fixed' },
};

export function applyCoupon(code: string, subtotal: number): { discount: number; valid: boolean } {
  const coupon = COUPONS[code.toUpperCase()];
  if (!coupon) return { discount: 0, valid: false };

  if (coupon.type === 'percent') {
    return { discount: Math.round(subtotal * (coupon.discount / 100)), valid: true };
  }
  return { discount: Math.min(coupon.discount, subtotal), valid: true };
}
