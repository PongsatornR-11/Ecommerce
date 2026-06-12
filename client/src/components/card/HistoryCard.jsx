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
        <div className='bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-6 transition-colors duration-200'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60'>
                <div>
                    <h1 className='text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight'>Order History</h1>
                    <p className='text-xs text-slate-450 dark:text-slate-400 mt-1'>Logged in as <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user.email}</span></p>
                </div>
                <div className='bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-505 dark:text-slate-400 shadow-sm'>
                    <span>As of: {useCurrentTime()}</span>
                </div>
            </div>

            {/*container */}
            <div className='space-y-6'>
                {/* card loop order */}
                {orders?.slice().reverse().map((item, index) => {
                    return (
                        <div key={index} className='bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 p-5 rounded-2xl shadow-sm space-y-4 hover:border-slate-200 dark:hover:border-slate-700/80 transition-all duration-200'>
                            {/* header */}
                            <div className='flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/40'>
                                <div className='flex flex-col gap-0.5'>
                                    <span className='text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold'>Order Date & Time</span>
                                    <span className='font-bold text-xs text-slate-705 dark:text-slate-300'>{formatDate(item.updatedAt)} at {formatTime(item.updatedAt)}</span>
                                </div>
                                <div className={`${getStatusColor(item.orderStatus)} text-xs px-3 py-1.5 rounded-xl font-bold`}>
                                    {item.orderStatus}
                                </div>
                            </div>
                            
                            {/* table  loop product*/}
                            <div className="overflow-hidden border border-slate-100 dark:border-slate-800/80 rounded-xl bg-white dark:bg-slate-950 shadow-sm">
                                <table className='w-full text-left border-collapse'>
                                    <thead>
                                        <tr className='bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 text-slate-500 dark:text-slate-400'>
                                            <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider">Product</th>
                                            <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-right">Price</th>
                                            <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-center">Qty</th>
                                            <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                                        {/* product loop */}
                                        {item?.products.map((products, idx) => {
                                            return (
                                                <tr key={idx} className="text-slate-650 dark:text-slate-350 hover:bg-slate-50/30 dark:hover:bg-slate-900/10">
                                                    <td className="px-4 py-3 text-xs font-semibold">{products.product.title}</td>
                                                    <td className="px-4 py-3 text-xs text-right">{formatPrice(products.product.price)} THB</td>
                                                    <td className="px-4 py-3 text-xs text-center font-medium">{products.count}</td>
                                                    <td className="px-4 py-3 text-xs font-bold text-right text-indigo-650 dark:text-indigo-400">{formatPrice(products.count * products.product.price)} THB</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* total */}
                            <div className="flex justify-end pt-1">
                                <div className='text-right space-y-0.5'>
                                    <p className='text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold'>Total Amount Paid</p>
                                    <p className="text-sm font-extrabold text-slate-850 dark:text-slate-100">{formatPrice(item.cartTotal)} <span className="text-[10px] font-medium text-slate-500">THB</span></p>
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