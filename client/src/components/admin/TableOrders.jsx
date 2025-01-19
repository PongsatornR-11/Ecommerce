import React, { useEffect, useState } from 'react'
import { getOrdersAdmin } from '../../api/admin'
import useEcomStore from '../../store/ecom-store'

const TableOrders = () => {

    const token = useEcomStore((state) => state.token)

    const [orders, setOrders] = useState([])

    useEffect(() => {
        getOrdersAdmin(token)
            .then((res) => {
                setOrders(res.data)
                // console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])
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
                            <th>Update status</th>
                        </tr>
                    </thead>
                    <tbody className='border'>
                        {
                            orders?.map((item, index) => {
                                console.log(item)
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
                                                        <span className='text-sm'>{product.count} x {product.product.price}</span>
                                                    </li>
                                                </div>)
                                            })}
                                        </td>



                                        <td>{item.orderStatus}</td>
                                        <td>{item.cartTotal}</td>
                                        <td>{item.orderedBy.address}</td>
                                        <td>action</td>
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