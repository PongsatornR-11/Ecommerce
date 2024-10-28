// import axios for handle with back end
import axios from "axios";

export const currentUser = async(token) =>
  await axios.post(
    "http://localhost:5000/api/current-user",
    // send data
    {},
    // configuration
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const currentAdmin = async (token) => {
  return await axios.post(
    "http://localhost:5000/api/current-admin",
    //data
    {},
    // configuration
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
