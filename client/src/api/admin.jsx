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