import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Product } from "@/lib/mock-data";

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        set((state) => ({
          items: state.items.some((i) => i.id === product.id)
            ? state.items
            : [product, ...state.items],
        }));
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
      },

      toggleItem: (product: Product) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(product.id)) {
          removeItem(product.id);
        } else {
          addItem(product);
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some((i) => i.id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "supershop-wishlist",
    }
  )
);
