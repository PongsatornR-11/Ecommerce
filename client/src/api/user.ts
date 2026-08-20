import { apiClient } from "./axios";
import { Order } from "./types";

export interface AddressItem {
  id: number;
  title: string;
  recipient?: string;
  phone?: string;
  address: string;
  isDefault: boolean;
  createdAt?: string;
}

export const createUserCart = async (cart: Array<{ id: number; count: number; price: number }>) => {
  return apiClient.post("/user/cart", { cart });
};

export const listUserCart = async () => {
  return apiClient.get("/user/cart");
};

export const saveAddress = async (address: string) => {
  return apiClient.post("/user/address", { address });
};

export const getUserAddresses = async () => {
  return apiClient.get<{ ok: boolean; addresses: AddressItem[] }>("/user/addresses");
};

export const addUserAddress = async (data: { title?: string; address: string; recipient?: string; phone?: string; isDefault?: boolean }) => {
  return apiClient.post<{ ok: boolean; address: AddressItem }>("/user/addresses", data);
};

export const setDefaultAddress = async (addressId: number) => {
  return apiClient.patch<{ ok: boolean; address: AddressItem }>(`/user/addresses/${addressId}/default`);
};

export const deleteAddress = async (addressId: number) => {
  return apiClient.delete<{ ok: boolean }>(`/user/addresses/${addressId}`);
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
