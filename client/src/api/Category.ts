import { apiClient } from "./axios";
import { Category } from "./types";

export const createCategory = async (data: { name: string }) => {
  return apiClient.post<Category>("/category", data);
};

export const listCategory = async () => {
  return apiClient.get<Category[]>("/category");
};

export const removeCategory = async (id: number) => {
  return apiClient.delete<{ message: string }>(`/category/${id}`);
};
