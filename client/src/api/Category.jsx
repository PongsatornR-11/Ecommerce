import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createCategory = async (token, form) => {
  return await axios.post(`${API_BASE_URL}/category`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listCategory = async () => {
  return await axios.get(`${API_BASE_URL}/category`);
};

export const removeCategory = async (token, id) => {
  return await axios.delete(`${API_BASE_URL}/category/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
