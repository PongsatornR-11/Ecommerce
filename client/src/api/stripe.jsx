import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const payment = async (token) => {
    return await axios.post (`${API_BASE_URL}/user/create-payment-intent`,{}, {
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
}