import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getOrdersAdmin = async (token) =>
    await axios.get(
        `${API_BASE_URL}/admin/orders`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

export const changeOrderStatus = async (token, orderId, orderStatus) => {

    return axios.put(`${API_BASE_URL}/admin/order-status`,
        {
            orderId,
            orderStatus
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
}

export const getListAllUsers = async (token) => {
    return axios.get(`${API_BASE_URL}/users`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
}

export const changeUserStatus = async (token, value) => {
    return axios.post(`${API_BASE_URL}/change-status`,
        value,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
}

export const changeUserRole = async (token, value) =>{
    return axios.post(`${API_BASE_URL}/change-role`, value, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}