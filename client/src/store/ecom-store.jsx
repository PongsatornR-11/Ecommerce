import axios from "axios";
import { create } from "zustand";

// create, handle local storage
import { persist, createJSONStorage } from "zustand/middleware";

const ecomStore = (set) => ({
  user: null,
  token: null,
  actionLogin: async (form) => {
    const res = await axios.post("http://localhost:5000/api/login", form);

    set({
      //set user and token key data from backend
      user: res.data.payload,
      token: res.data.token,
    });
    return res;
  },
});

const userPersist = {
  name: "ecom-store",
  storage: createJSONStorage(() => localStorage),
};

const useEcomStore = create(persist(ecomStore, userPersist));
//user persist for save data to local storage.

export default useEcomStore;
