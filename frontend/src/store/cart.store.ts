import { create } from 'zustand';
import type { CartItem, CatalogItem } from '../shared/types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CatalogItem, quantity: number) => void;
  removeItem: (catalogItemId: string) => void;
  updateQuantity: (catalogItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

const STORAGE_KEY = 'nufurnix_cart';

const loadCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: loadCart(),

  addItem: (item, quantity) => {
    set((state) => {
      const existing = state.items.find(
        (cartItem) => cartItem.catalogItem.id === item.id
      );

      let newItems: CartItem[];

      if (existing) {
        newItems = state.items.map((cartItem) =>
          cartItem.catalogItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        newItems = [...state.items, { catalogItem: item, quantity }];
      }

      saveCart(newItems);
      return { items: newItems };
    });
  },

  removeItem: (catalogItemId) => {
    set((state) => {
      const newItems = state.items.filter(
        (item) => item.catalogItem.id !== catalogItemId
      );
      saveCart(newItems);
      return { items: newItems };
    });
  },

  updateQuantity: (catalogItemId, quantity) => {
    set((state) => {
      const newItems = state.items.map((item) =>
        item.catalogItem.id === catalogItemId
          ? { ...item, quantity }
          : item
      );
      saveCart(newItems);
      return { items: newItems };
    });
  },

  clearCart: () => {
    set({ items: [] });
    saveCart([]);
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));