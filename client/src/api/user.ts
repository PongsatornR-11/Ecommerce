import { apiClient } from "./axios";
import { Order } from "./types";

export const createUserCart = async (cart: Array<{ id: number; count: number; price: number }>) => {
  return apiClient.post("/user/cart", { cart });
};

export const listUserCart = async () => {
  return apiClient.get("/user/cart");
};

export const saveAddress = async (address: string) => {
  return apiClient.post("/user/address", { address });
};

export const saveOrder = async (paymentIntent: any) => {
  return apiClient.post<{ ok: boolean; order: Order }>("/user/order", { paymentIntent });
};

export const getOrders = async () => {
  return apiClient.get<{ ok: boolean; orders: Order[] }>("/user/order");
};

export const payment = async () => {
  return apiClient.post<{ clientSecret: string; amount: number; currency: string }>("/user/create-payment-intent");
};
