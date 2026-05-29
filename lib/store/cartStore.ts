'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  color: string;
  size: string;
  priceRetail: number;
  priceWholesale: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  wholesaleMinQty: number;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalQuantity: () => number;
  totalPrice: () => number;
  isWholesaleActive: () => boolean;
  unitPriceFor: (item: CartItem, wholesaleActive: boolean) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      wholesaleMinQty: 6,

      addItem: (newItem) => {
        const id = `${newItem.productId}-${newItem.color}-${newItem.size}`;
        set((state) => {
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { ...newItem, id }],
            isOpen: true,
          };
        });
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQty: (id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      totalQuantity: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      isWholesaleActive: () => {
        const total = get().items.reduce((s, i) => s + i.quantity, 0);
        return total >= get().wholesaleMinQty;
      },

      unitPriceFor: (item, wholesaleActive) =>
        wholesaleActive ? item.priceWholesale : item.priceRetail,

      totalPrice: () => {
        const state = get();
        const wholesale = state.isWholesaleActive();
        return state.items.reduce((sum, i) => {
          const unit = wholesale ? i.priceWholesale : i.priceRetail;
          return sum + unit * i.quantity;
        }, 0);
      },
    }),
    {
      name: 'dulce-sonadora-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
