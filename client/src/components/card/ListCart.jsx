import React from 'react'
import { List } from 'lucide-react'
import useEcomStore from '../../store/ecom-store'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createUserCart } from '../../api/user'
import { formatPrice } from '../../utils/number'
import { useCurrentTime } from '../../utils/datetimeformat'

const ListCart = () => {

    const cart = useEcomStore((state) => state.carts)
    const getTotalPrice = useEcomStore((state) => state.getTotalPrice)
    const user = useEcomStore((state) => state.user)
    const token = useEcomStore((state) => state.token)
    const navigate = useNavigate()

    const handleCheckout = async () => {
        await createUserCart(token, { cart: cart })
            .then((res) => {
                console.log(res)
                toast.success('Checkout success!')
                navigate('/checkout')
            })
            .catch((err) => {
                console.log(err)
                toast.warning(err.response.data.message)
            })
    }

    return (
        <div className='bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm transition-colors duration-200'>
            {/* header */}
            <div className='flex justify-between items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/60'>
                <div className='flex items-center gap-2 text-slate-800 dark:text-slate-100'>
                    <List size={20} className="text-indigo-600 dark:text-indigo-400" />
                    <h2 className='text-base font-bold uppercase tracking-wider'>Summary ({cart.length} {cart.length > 1 ? 'items' : 'item'})</h2>
                </div>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{useCurrentTime()}</span>
            </div>
            
            {/* list cart */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                {/* left */}
                <div className='md:col-span-2 space-y-3'>
                    {/* Card */}
                    {cart.map((item, index) => (
                        <div key={index} className='bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 p-4 rounded-xl shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition-colors duration-200'>
                            {/* Row 1 */}
                            <div className='flex items-center justify-between'>
                                {/* left */}
                                <div className='flex gap-3 items-center min-w-0'>
                                    {
                                        item.images && item.images.length > 0
                                            ? <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 flex-none">
                                                <img src={item.images[0].url} className='w-full h-full object-cover hover:scale-105 transition-transform duration-350' />
                                              </div>
                                            : <div className='w-16 h-16 bg-slate-100 dark:bg-slate-850 rounded-lg text-center flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs font-semibold flex-none'>
                                                No Image
                                              </div>
                                    }

                                    <div className="min-w-0">
                                        <p className='font-bold text-slate-800 dark:text-slate-100 text-sm truncate'>{item.title}</p>
                                        <p className='text-xs text-slate-450 dark:text-slate-400 mt-1'>{formatPrice(item.price)} THB x {item.count}</p>
                                    </div>
                                </div>
                                <div className="pl-2 flex-none">
                                    <div className='font-bold text-indigo-600 dark:text-indigo-400 text-sm'>
                                        {formatPrice(item.price * item.count)} <span className="text-[10px] font-medium text-slate-400">THB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* right */}
                <div className='border border-slate-100 dark:border-slate-800 p-5 rounded-xl bg-white dark:bg-slate-950 shadow-sm space-y-4 h-fit transition-colors duration-200'>
                    <h3 className='text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800'>Price Summary</h3>
                    
                    <div className='flex justify-between items-center py-1'>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase">NET PRICE</span>
                        <span className='text-lg font-extrabold text-slate-800 dark:text-slate-100'>{formatPrice(getTotalPrice())} <span className="text-xs font-medium text-slate-450 dark:text-slate-500">THB</span></span>
                    </div>

                    <div className='flex flex-col gap-2 pt-2'>
                        <Link to='/shop' className="w-full">
                            <button className='w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-355 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold py-2.5 rounded-xl transition-all duration-200'>
                                Edit Cart
                            </button>
                        </Link>

                        {user
                            ? <button
                                disabled={cart.length < 1}
                                onClick={handleCheckout}
                                className='w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-xs py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200'>
                                Checkout
                              </button>
                            : <Link to='/login' className="w-full">
                                <button className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200'>
                                    Login to Checkout
                                </button>
                              </Link>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListCart