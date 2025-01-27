import axios from "axios";
import { create } from "zustand";
import _ from 'lodash'

// create, handle local storage
import { persist, createJSONStorage } from "zustand/middleware";

import { listCategory } from "../api/Category";
import { listProduct, searchFilter } from "../api/product";

const ecomStore = (set, get) => ({
  user: null,
  token: null,
  categories: [],
  products: [],
  carts: [],
  actionLogin: async (form) => {
    const res = await axios.post("http://localhost:5000/api/login", form);

    set({
      //set user and token key data from backend
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
      console.log(err);
    }
  },
  getProduct: async (count) => {
    try {
      const res = await listProduct(count);
      set({ products: res.data });
    } catch (err) {
      console.log(err);
    }
  },
  actionSearchFilter: async (arg) => {
    try {
      const res = await searchFilter(arg)
      set({ products: res.data })
    } catch (err) {
      console.log(err)
    }
  },
  actionAddCart: async (product) => {
    const carts = get().carts
    const updateCart = [...carts, { ...product, count: 1 }]

    // unique step
    const unique = _.unionWith(updateCart, _.isEqual)

    set({ carts: unique })
  },
  actionUpdateQuantity: (productId, newQuantity) => {
    set((state) => ({
      carts: state.carts.map(
        item =>
          item.id === productId
            ? { ...item, count: Math.max(1, newQuantity) }
            : item
      )
    }))
  },
  actionRemoveProductOncart: (productId) => {
    set((state) => ({
      carts: state.carts.filter((item) =>
        item.id !== productId)
    }))
  },
  getTotalPrice: () => {
    return get().carts.reduce((sum, item) => {
      return sum + (item.price * item.count)
    }, 0)
  },
  actionClearCart: () => {
    set({ carts: [] })
  },
});

const userPersist = {
  name: "ecom-store",
  storage: createJSONStorage(() => localStorage),
};

const useEcomStore = create(persist(ecomStore, userPersist));
//user persist for save data to local storage.

export default useEcomStore;
