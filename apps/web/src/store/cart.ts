'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  savedForLater: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  setCoupon: (code: string | null, discount: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],
      couponCode: null,
      couponDiscount: 0,

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            const newQty = Math.min(existing.quantity + quantity, item.stock);
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: newQty } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: Math.min(quantity, item.stock) }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, i.stock) }
              : i
          ),
        }));
      },

      saveForLater: (productId) => {
        set((state) => {
          const item = state.items.find((i) => i.productId === productId);
          if (!item) return state;
          return {
            items: state.items.filter((i) => i.productId !== productId),
            savedForLater: [...state.savedForLater, item],
          };
        });
      },

      moveToCart: (productId) => {
        set((state) => {
          const item = state.savedForLater.find((i) => i.productId === productId);
          if (!item) return state;
          return {
            savedForLater: state.savedForLater.filter((i) => i.productId !== productId),
            items: [...state.items, item],
          };
        });
      },

      setCoupon: (code, discount) => {
        set({ couponCode: code, couponDiscount: discount });
      },

      clearCart: () => {
        set({ items: [], couponCode: null, couponDiscount: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().couponDiscount;
        const shipping = subtotal >= 50000 || subtotal === 0 ? 0 : 2500;
        return Math.max(0, subtotal - discount + shipping);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    { name: 'techymart-cart' }
  )
);
