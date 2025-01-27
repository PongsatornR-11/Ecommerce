import React, { useState, useEffect } from 'react'
import { getOrders } from '../../api/user'
import useEcomStore from '../../store/ecom-store'

// utils import
import { formatDate, formatTime } from '../../utils/datetimeformat'
import { formatPrice } from '../../utils/number'
import { getStatusColor } from '../../utils/statusColor'
import { useCurrentTime } from '../../utils/datetimeformat'

const HistoryCard = () => {

    const token = useEcomStore((state) => state.token)
    const user = useEcomStore((state) => state.user)
    const [orders, setOrders] = useState([])

    useEffect(() => {
        getOrders(token)
            .then((res) => {
                setOrders(res.data.orders)
            })
            .catch((err) => {
                console.log(err)
            });
    }, [])

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold m-4'> Order History of user: {user.email} </h1>
                <p><span>{useCurrentTime()}</span></p>
            </div>

            {/*container */}
            <div className='space-y-4'>
                {/* card loop order */}
                {orders?.slice().reverse().map((item, index) => {
                    // console.log(item)
                    return (
                        <div key={index} className='bg-gray-100 p-4 rounded-md shadow-md my-1'>
                            {/* header */}
                            <div className='flex justify-between mb-1'>
                                <div className='flex flex-col'>
                                    <p className='text-sm'>Order date time </p>
                                    <span className='font-bold text-l'>{formatDate(item.updatedAt)} {formatTime(item.updatedAt)}</span>
                                </div>
                                <div className={`${getStatusColor(item.orderStatus)} p-2 rounded-md m-2`}>
                                    {item.orderStatus}
                                </div>
                            </div>
                            {/* table  loop product*/}
                            <div>
                                <table className='border w-full '>
                                    <thead>
                                        <tr className='bg-gray-200'>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* product loop */}
                                        {item?.products.map((products, index) => {
                                            // console.log(products)
                                            return (
                                                <tr key={index}>
                                                    <td>{products.product.title}</td>
                                                    <td>{formatPrice(products.product.price)} THB</td>
                                                    <td>{products.count}</td>
                                                    <td>{formatPrice(products.count * products.product.price)} THB</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {/* total */}
                            <div>
                                <div className='text-right mr-3 mt-2'>
                                    <p>Total Price</p>
                                    <p>{formatPrice(item.cartTotal)} THB</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default HistoryCard