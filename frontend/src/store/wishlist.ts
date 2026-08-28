import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Product } from "@/types/types";

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
          items: state.items.some((i) => i._id === product._id)
            ? state.items
            : [product, ...state.items],
        }));
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i._id !== productId),
        }));
      },

      toggleItem: (product: Product) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(product._id)) {
          removeItem(product._id);
        } else {
          addItem(product);
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some((i) => i._id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "supershop-wishlist",
    }
  )
);
