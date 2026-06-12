import React, { useEffect, useState } from 'react'
import { getOrdersAdmin, changeOrderStatus } from '../../api/admin'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'

// utils import
import { formatPrice } from '../../utils/number'
import { formatDate, formatDateTh, useCurrentTime } from '../../utils/datetimeformat'
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
                setOrders(res.data.reverse())
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
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm transition-colors duration-200">
            {/* Header */}
            <div className='flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-4'>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Manage Orders</h2>
                <span className='text-xs font-semibold text-slate-400 dark:text-slate-500'>
                    {useCurrentTime()}
                </span>
            </div>

            {/* Table Container */}
            <div className="overflow-hidden border border-slate-100 dark:border-slate-800/80 rounded-xl bg-white dark:bg-slate-950 shadow-sm mt-4">
                <table className='w-full text-left border-collapse table-auto'>
                    <thead>
                        <tr className='bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 text-slate-500 dark:text-slate-400'>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-center w-12">No.</th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider">User</th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider">Product details</th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-center">Status</th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-right">Total</th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider">Delivery address</th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider">Order Date</th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                        {
                            orders?.map((item, index) => {
                                return (
                                    <tr key={index} className='text-slate-650 dark:text-slate-350 hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors'>
                                        <td className='px-4 py-4 text-center text-xs font-medium'>{index + 1}</td>
                                        <td className="px-4 py-4 text-xs font-semibold">
                                            <p className="truncate max-w-[120px]" title={item.orderedBy.email}>
                                                {item.orderedBy.email}
                                            </p>
                                        </td>

                                        <td className='px-4 py-4 text-xs max-w-[200px]'>
                                            <ul className="space-y-1">
                                                {item.products?.map((product, idx) => {
                                                    return (
                                                        <li key={idx} className="list-disc list-inside">
                                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                                {product.product.title.length > 20 ? product.product.title.substring(0, 20) + '... ' : product.product.title}
                                                            </span>
                                                            <span className='text-[10px] text-slate-400 dark:text-slate-500 ml-1.5'>({product.count} x {formatPrice(product.product.price)})</span>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            <span className={`${getStatusColor(item.orderStatus)} px-2 py-1 rounded-lg text-[10px] font-bold`}>
                                                {item.orderStatus}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-right text-xs font-bold text-indigo-600 dark:text-indigo-400">{formatPrice(item.cartTotal)} THB</td>

                                        <td className="px-4 py-4 text-xs max-w-[150px] truncate" title={item.orderedBy.address}>
                                            {item.orderedBy.address}
                                        </td>

                                        <td className="px-4 py-4 text-xs">{formatDate(item.createdAt)}</td>
                                        <td className="px-4 py-4 text-center">
                                            <select
                                                className={`text-[10px] font-bold p-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                                                value={item.orderStatus}
                                                onChange={(event) =>
                                                    handleChangeOrderStatus(token, item.id, event.target.value)
                                                }
                                            >
                                                <option value='Not Process' className="text-slate-750 dark:text-slate-200">Not Process</option>
                                                <option value='Processing' className="text-amber-600 dark:text-amber-400">Processing</option>
                                                <option value='Dispatched' className="text-blue-600 dark:text-blue-400">Dispatched</option>
                                                <option value='Cancelled' className="text-rose-600 dark:text-rose-450">Cancelled</option>
                                                <option value='Completed' className="text-emerald-600 dark:text-emerald-450">Completed</option>
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