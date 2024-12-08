import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createProduct = async (token, form) => {
  return await axios.post(`${API_BASE_URL}/product`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listProduct = async (count = 20) => {
  return await axios.get(`${API_BASE_URL}/products/${count}`);
};

export const readProduct = async (token, id) => {
  return await axios.get(`${API_BASE_URL}/product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteProduct = async (token, id) => {
  return await axios.delete(`${API_BASE_URL}/product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProduct = async (token, id, form) => {
  return await axios.put(`${API_BASE_URL}/product/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadFiles = async (token, form) => {
  return await axios.post(
    `${API_BASE_URL}/images`,
    {
      image: form,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const removeFile = async (token, public_id) => {
  return await axios.post(
    `${API_BASE_URL}/removeimages`,
    {
      public_id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const searchFilter = async (arg) => {
  return await axios.post(`${API_BASE_URL}/search/filters`, arg)
}
