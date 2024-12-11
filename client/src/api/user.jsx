import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createUserCart = async (token, cart) => {
    return await axios.post(`${API_BASE_URL}/user/cart`, cart, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listUserCart = async (token) => {
    return await axios.get(`${API_BASE_URL}/user/cart`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const saveAddress = async (token, address) => {
    return await axios.post(`${API_BASE_URL}/user/address`,
        { address: address }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const saveOrder = async (token, payload) => {
    return await axios.post(`${API_BASE_URL}/user/order`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}