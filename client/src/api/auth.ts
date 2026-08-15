import { apiClient } from "./axios";

export const registerUser = async (data: { email: string; password: string; name?: string }) => {
  return apiClient.post("/register", data);
};

export const loginUser = async (data: { email: string; password: string }) => {
  return apiClient.post("/login", data);
};

export const currentUser = async () => {
  return apiClient.post("/current-user");
};

export const currentAdmin = async () => {
  return apiClient.post("/current-admin");
};

export const logoutUser = async () => {
  return apiClient.post("/logout");
};
