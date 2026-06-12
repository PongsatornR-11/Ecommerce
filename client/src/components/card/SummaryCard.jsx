import React, { useEffect, useState } from 'react'
import useEcomStore from '../../store/ecom-store'
import { listUserCart, saveAddress } from '../../api/user'  
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../../utils/number'

const SummaryCard = () => {
    const token = useEcomStore(state => state.token)
    const [products, setProducts] = useState([])
    const [cartTotal, setCartTotal] = useState(0)
    const [address, setAddress] = useState('')
    const [addressUpdate, setAddressUpdate] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        handleListUserCart(token)
    }, [])

    const handleListUserCart = (token) => {
        listUserCart(token)
            .then(res => {
                setProducts(res.data.products)
                setCartTotal(res.data.cartTotal)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const handleSaveAddress = () => {
        if(!address) {
            return toast.error('Address is required')
        }
        saveAddress(token, address)
            .then(res => {
                toast.success(res.data.message)
                setAddressUpdate(true)
            })
            .catch(err => {
                console.log(err)
            })  
    }

    const handleCheckout = () => {
        if(!addressUpdate) {
            return toast.warning('Please save address before checkout')
        }
        navigate('/user/payment')
    }

    return (
        <div className='max-w-7xl mx-auto'>
            <div className='flex flex-col lg:flex-row justify-between gap-6'>
                {/* left - Address */}
                <div className='w-full lg:w-2/3'>
                    <div className='border border-slate-100 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm space-y-4 transition-colors duration-200'>
                        <h2 className='text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800'>Shipping Address</h2>
                        <textarea 
                            className='w-full h-28 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none'
                            placeholder='Enter your full delivery address (Street, City, Postal Code, Country)'
                            required
                            onChange={(e) => setAddress(e.target.value)} 
                        />
                        <button 
                            onClick={handleSaveAddress}
                            className='bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 active:scale-97 transition-all duration-200'
                        >
                            Save Address
                        </button>
                    </div>
                </div>
                
                {/* right - Summary details */}
                <div className='w-full lg:w-1/3'>
                    <div className='border border-slate-100 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm space-y-5 transition-colors duration-200'>
                        <h2 className='text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800'>Summary Details</h2>
                        
                        {/* Products list */}
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                            {products.map((item, index) => (
                                <div key={index} className="flex justify-between items-center gap-3">
                                    <div className='flex gap-3 items-center min-w-0'>
                                        {
                                            item.product.images && item.product.images.length > 0
                                                ? <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 flex-none">
                                                    <img src={item.product.images[0].url} className='w-full h-full object-cover' />
                                                  </div>
                                                : <div className='w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg text-center flex items-center justify-center text-slate-400 dark:text-slate-500 text-[10px] font-semibold flex-none'>
                                                    No image
                                                  </div>
                                        }
                                        <div className="min-w-0">
                                            <p className='text-xs font-bold text-slate-800 dark:text-slate-200 truncate'>{item.product.title}</p>
                                            <p className='text-[10px] text-slate-450 dark:text-slate-400 mt-0.5'>{item.count} x {formatPrice(item.product.price)} THB</p>
                                        </div>
                                    </div>
                                    <div className="flex-none">
                                        <p className='text-xs font-extrabold text-slate-800 dark:text-slate-100'>{formatPrice(item.count * item.price)} <span className="text-[9px] font-medium text-slate-400">THB</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charges breakdown */}
                        <div className='space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400'>
                            <div className='flex justify-between items-center'>
                                <span>Delivery Charges:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">21.00 THB</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span>Discount:</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-450">-21.00 THB</span>
                            </div>
                        </div>
                        
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                            <div className='flex justify-between items-center'>
                                <span className='text-xs font-bold text-slate-650 dark:text-slate-350 uppercase'>Net Total:</span>
                                <span className='text-lg font-extrabold text-indigo-600 dark:text-indigo-400'>{formatPrice(cartTotal)} <span className="text-xs font-medium text-slate-450">THB</span></span>
                            </div>
                        </div>

                        {/* Checkout button */}
                        <div className="pt-2">
                            <button
                                onClick={handleCheckout}
                                className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition-all duration-200'
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SummaryCard