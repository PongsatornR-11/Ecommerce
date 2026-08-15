import { apiClient } from "./axios";
import { Product } from "./types";

export const createProduct = async (data: any) => {
  return apiClient.post<Product>("/product", data);
};

export const listProduct = async (count: number = 20) => {
  return apiClient.get<Product[]>(`/products/${count}`);
};

export const readProduct = async (id: number) => {
  return apiClient.get<Product>(`/product/${id}`);
};

export const updateProduct = async (id: number, data: any) => {
  return apiClient.put<Product>(`/product/${id}`, data);
};

export const deleteProduct = async (id: number) => {
  return apiClient.delete<{ message: string }>(`/product/${id}`);
};

export const listProductBy = async (sort: string, order: "asc" | "desc", limit: number) => {
  return apiClient.post<Product[]>("/productby", { sort, order, limit });
};

export const searchFilter = async (filterObj: any) => {
  return apiClient.post<Product[]>("/search/filters", filterObj);
};

export const uploadFiles = async (image: string) => {
  return apiClient.post("/images", { image });
};

export const removeFiles = async (public_id: string) => {
  return apiClient.post("/removeimages", { public_id });
};

export const removeFile = removeFiles;
