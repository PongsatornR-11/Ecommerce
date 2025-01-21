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
        <div className='mx-auto'>
            <div className='flex justify-between gap-4'>
                {/* left */}
                <div className='w-2/3'>
                    <div className='border p-4 rounded-md bg-gray-100 shadow-md space-y-2'>
                        <h1 className='text-lg font-semibold'>Address</h1>
                        <textarea className='w-full h-24 border p-3 rounded-md'
                        placeholder='Enter your address'
                        required
                        onChange={(e) => setAddress(e.target.value)} />
                        <button 
                            onClick={handleSaveAddress}
                            className='bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500 hover:shadow-md hover:duration-200 hover:scale-105'>Save Address</button>
                    </div>
                </div>
                {/* right */}
                <div className='w-1/3'>
                    <div className='border p-4 rounded-md bg-gray-100 shadow-md space-y-2'>
                        <p className='text-lg font-semibold'>Summary Details</p>
                        {products.map((item, index) => (
                            <div key={index}>
                                <div className='flex justify-between gap-2 items-end'>
                                    <div className='flex gap-2 items-center'>
                                        {
                                            item.product.images && item.product.images.length > 0
                                                ? <img src={item.product.images[0].url} className='w-16 h-16 object-cover rounded-md hover:scale-110 hover:duration-200' />
                                                : <div className='w-16 h-16 bg-gray-200 rounded-md text-center flex items-center justify-center'>
                                                    No Image
                                                </div>
                                        }
                                        <div>
                                            <p>{item.product.title.length > 15 ? item.product.title.substring(0, 15) + '...' : item.product.title}</p>
                                            <p className='text-sm'>{item.count} x {formatPrice(item.product.price)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='font-semibold'>{formatPrice(item.count * item.price)} THB</p>
                                    </div>
                                </div>
                            </div>
                            
                        ))}

                        {/* items list */}
                        <div className='space-y-1'>
                            <hr />
                            <div className='flex justify-between gap-4 items-end'>
                                <p>Delivery Charges:</p>
                                <p>21.00</p>
                            </div>
                            <div className='flex justify-between gap-4 items-end'>
                                <p>Discount:</p>
                                <p>21.00</p>
                            </div>
                        </div>
                        <hr />
                        <div>
                            <div className='flex justify-between gap-4 items-end'>
                                <p className='font-semibold'>Net Total:</p>
                                <p className='font-bold text-xl'>{formatPrice(cartTotal)} THB</p>
                            </div>
                        </div>
                        <hr />
                        {/* checkout button */}
                        <div>
                            <button
                            onClick={handleCheckout}
                            className='w-full bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500 hover:shadow-md hover:duration-200 hover:scale-105'>Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SummaryCard