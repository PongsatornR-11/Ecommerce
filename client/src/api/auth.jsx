// import axios for handle with back end
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const currentUser = async (token) =>
  await axios.post(
    `${API_BASE_URL}/current-user`,
    // send data
    {},
    // configuration
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export const currentAdmin = async (token) => {
  return await axios.post(
    `${API_BASE_URL}/current-admin`,
    //data
    {},
    // configuration
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
