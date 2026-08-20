import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listCategory } from "../api/Category";
import { listProduct, searchFilter } from "../api/product";
import { loginUser, logoutUser } from "../api/auth";

const ecomStore = (set, get) => ({
  user: null,
  token: null,
  categories: [],
  products: [],
  carts: [],
  searchQuery: "",
  isCartOpen: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

  actionLogin: async (form) => {
    const res = await loginUser(form);
    set({
      user: res.data.payload,
      token: res.data.token,
    });
    return res;
  },

  getCategory: async () => {
    try {
      const res = await listCategory();
      set({ categories: res.data });
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  },

  getProduct: async (count) => {
    try {
      const res = await listProduct(count);
      set({ products: res.data });
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  },

  actionSearchFilter: async (arg) => {
    try {
      const res = await searchFilter(arg);
      set({ products: res.data });
    } catch (err) {
      console.error("Failed to search products:", err);
    }
  },

  actionAddCart: (product) => {
    const carts = get().carts;
    const existingProduct = carts.find((item) => item.id === product.id);

    let updateCart;
    if (existingProduct) {
      updateCart = carts.map((item) =>
        item.id === product.id ? { ...item, count: item.count + 1 } : item
      );
    } else {
      updateCart = [...carts, { ...product, count: 1 }];
    }

    set({ carts: updateCart });
  },

  actionUpdateQuantity: (productId, newQuantity) => {
    set((state) => ({
      carts: state.carts.map((item) =>
        item.id === productId
          ? { ...item, count: Math.max(1, newQuantity) }
          : item
      ),
    }));
  },

  actionRemoveProductOncart: (productId) => {
    set((state) => ({
      carts: state.carts.filter((item) => item.id !== productId),
    }));
  },

  getTotalPrice: () => {
    return get().carts.reduce((sum, item) => {
      return sum + item.price * item.count;
    }, 0);
  },

  actionClearCart: () => {
    set({ carts: [] });
  },

  actionLogout: async () => {
    try {
      await logoutUser();
    } catch (e) {
      // ignore
    }
    set({
      user: null,
      token: null,
      carts: [],
    });
  },
});

const userPersist = {
  name: "ecom-store",
  storage: createJSONStorage(() => localStorage),
};

const useEcomStore = create(persist(ecomStore, userPersist));

export default useEcomStore;
