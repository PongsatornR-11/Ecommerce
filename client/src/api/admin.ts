import { apiClient } from "./axios";
import { User, Order } from "./types";

export const getListAllUsers = async () => {
  return apiClient.get<User[]>("/users");
};

export const changeUserStatus = async (id: number, enabled: boolean) => {
  return apiClient.post("/change-status", { id, enabled });
};

export const changeUserRole = async (id: number, role: string) => {
  return apiClient.post("/change-role", { id, role });
};

export const getAdminOrders = async () => {
  return apiClient.get<Order[]>("/admin/orders");
};

export const getOrdersAdmin = getAdminOrders;

export const changeOrderStatus = async (orderId: number, orderStatus: string) => {
  return apiClient.put("/admin/order-status", { orderId, orderStatus });
};
