import axios from "axios";

export const createCategory = async (token, form) => {
  return axios.post("http://localhost:5000/api/category", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
