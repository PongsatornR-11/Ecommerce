import React, { useState, useEffect } from 'react'
import { getOrders } from '../../api/user'
import useEcomStore from '../../store/ecom-store'

const HistoryCard = () => {

    const token = useEcomStore((state) => state.token)
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
            <h1 className='text-2xl font-bold m-4'>Order History</h1>

            {/*container */}
            <div className='space-y-4'>
                {/* card loop order */}
                {orders?.map((item, index) => {
                    console.log(item)
                    return (
                        <div key={index} className='bg-gray-100 p-4 rounded-md shadow-md my-1'>
                            {/* header */}
                            <div className='flex justify-between'>
                                <div>
                                    <p className='text-sm'>Order date</p>
                                    <p className='font-bold'>{item.updatedAt}</p>
                                </div>
                                <div>
                                    {item.orderStatus}
                                </div>
                            </div>
                            {/* table  loop product*/}
                            <div>
                                <table className='border w-full '>
                                    <tr className='bg-gray-200'>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                    <tbody>
                                        {/* product loop */}
                                        {item?.products.map((products, index) => {
                                            // console.log(products)
                                            return (
                                                <tr key={index}>
                                                    <td>{products.product.title}</td>
                                                    <td>{products.product.price}</td>
                                                    <td>{products.count}</td>
                                                    <td>{products.count * products.product.price}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {/* total */}
                            <div>
                                <div className='text-right'>
                                    <p>Total Price</p>
                                    <p>{item.cartTotal}</p>
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