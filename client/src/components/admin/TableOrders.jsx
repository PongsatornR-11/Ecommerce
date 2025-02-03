import React, { useEffect, useState } from 'react'
import { getOrdersAdmin, changeOrderStatus } from '../../api/admin'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'

// utils import
import { formatPrice } from '../../utils/number'
import { formatDate, formatDateTh, formatHourFromNow} from '../../utils/datetimeformat'
import { getStatusColor } from '../../utils/statusColor'

const TableOrders = () => {

    const token = useEcomStore((state) => state.token)
    const [orders, setOrders] = useState([])

    useEffect(() => {
        if (token) { handleGetOrderAdmin(token) }
    }, [])

    const handleGetOrderAdmin = (token) => {
        getOrdersAdmin(token)
            .then((res) => {
                setOrders(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleChangeOrderStatus = (token, orderId, orderStatus) => {
        changeOrderStatus(token, orderId, orderStatus)
            .then((res) => {
                console.log(res)
                toast.success('Order status updated')
                handleGetOrderAdmin(token)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    
    return (
        <div className="container mx-auto p-4 bg-[#ffffff] shadow-md">
            <h1 className="text-2xl font-bold">Orders</h1>
            <div className="flex justify-between items-center">
                <table className='w-full table-auto mt-4 border'>
                    <thead className='border'>
                        <tr className='bg-gray-300'>
                            <th>No.</th>
                            <th>User</th>
                            <th>Product</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>address</th>
                            <th>Order Date</th>
                            <th>Update status</th>
                        </tr>
                    </thead>
                    <tbody className='border'>
                        {
                            orders?.map((item, index) => {
                                return (
                                    <tr key={index} className='border'>
                                        <td className='text-center'>{index + 1}</td>
                                        <td>
                                            <p>
                                                {item.orderedBy.email}
                                            </p>
                                        </td>

                                        <td className='px-2 py-4'>
                                            {item.products?.map((product, index) => {
                                                return (<div>
                                                    <li key={index}>
                                                        {product.product.title.length > 15 ? product.product.title.substring(0, 15) + '... ' : product.product.title}
                                                        <span className='text-sm'>{product.count} x {formatPrice(product.product.price)}</span>
                                                    </li>
                                                </div>)
                                            })}
                                        </td>

                                        <td>
                                            <span
                                                className={`${getStatusColor(item.orderStatus)} px-2 py-1 rounded-md text-xs`}
                                            >
                                                {item.orderStatus}
                                            </span>
                                        </td>

                                        <td>{formatPrice(item.cartTotal)} THB</td>

                                        <td>{item.orderedBy.address}</td>
                                        
                                        <td>{formatDate(item.createdAt)}</td>
                                        <td>
                                            <select
                                                className={`text-xs p-1 rounded-md border ${getStatusColor(item.orderStatus)}`}
                                                value={item.orderStatus}
                                                onChange={(event) =>
                                                    handleChangeOrderStatus(token, item.id, event.target.value)
                                                }
                                            >
                                                <option value='Not Process' className={getStatusColor('Not Process')}>Not Process</option>
                                                <option value='Processing' className={getStatusColor('Processing')}>Processing</option>
                                                <option value='Dispatched' className={getStatusColor('Dispatched')}>Dispatched</option>
                                                <option value='Cancelled' className={getStatusColor('Cancelled')}>Cancelled</option>
                                                <option value='Completed' className={getStatusColor('Completed')}>Completed</option>
                                            </select>
                                        </td>

                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TableOrders