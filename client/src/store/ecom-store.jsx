import axios from "axios";
import { create } from "zustand";

// create, handle local storage
import { persist, createJSONStorage } from "zustand/middleware";

import { listCategory } from "../api/Category";

import { listProduct } from "../api/product";

const ecomStore = (set) => ({
  user: null,
  token: null,
  categories: [],
  products: [],
  actionLogin: async (form) => {
    const res = await axios.post("http://localhost:5000/api/login", form);

    set({
      //set user and token key data from backend
      user: res.data.payload,
      token: res.data.token,
    });
    return res;
  },
  getCategory: async (token) => {
    try {
      const res = await listCategory(token);
      set({ categories: res.data })
    } catch (err) {
      console.log(err);
    }
  },
  getProduct: async (token, count) => {
    try {
      const res = await listProduct(token, count)
      set({ products: res.data})
    } catch (err) {
      console.log(err)
    }
  }
});

const userPersist = {
  name: "ecom-store",
  storage: createJSONStorage(() => localStorage),
};

const useEcomStore = create(persist(ecomStore, userPersist));
//user persist for save data to local storage.

export default useEcomStore;
