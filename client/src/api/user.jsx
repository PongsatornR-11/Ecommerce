import axios from "axios";

export const createUserCart = async (token, cart) => {
    return await axios.post(`http://localhost:5000/api/user/cart`, cart, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listUserCart = async (token) => {
    return await axios.get(`http://localhost:5000/api/user/cart`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const saveAddress = async (token, address) => {
    return await axios.post(`http://localhost:5000/api/user/address`, 
        { address: address }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
