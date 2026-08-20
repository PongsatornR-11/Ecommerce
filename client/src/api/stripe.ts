import { apiClient } from "./axios";

export const payment = async (token?: string) => {
  return await apiClient.post("/user/create-payment-intent", {}, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
};
