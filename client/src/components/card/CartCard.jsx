import React from 'react'
import { Trash2 } from 'lucide-react';
import useEcomStore from '../../store/ecom-store';

const CartCard = () => {
    const actionUpdateQuantity = useEcomStore((state) => state.actionUpdateQuantity)
    const actionRemoveProductOncart = useEcomStore((state) => state.actionRemoveProductOncart)
    const getTotalPrice = useEcomStore((state) => state.getTotalPrice)

    const carts = useEcomStore((state) => state.carts)
    console.log('cart', carts)


    return (
        <div>
            <h1 className='text-xl font-bold'>Cart</h1>
            {/* Border */}
            <div className='border p-2'>
                {/* Card */}
                {
                    carts.map((item, index) => (
                        <div key={index} className='bg-white p-2 rounded-md mb-2'>
                            {/* Row 1 */}
                            <div className='flex items-center justify-between mb-2'>
                                {/* left */}
                                <div className='flex gap-2 items-center'>
                                    <div className='w-16 h-16 bg-gray-200 rounded-md flex items-center text-center' >
                                        {
                                            item.images && item.images.length > 0
                                                ? <img src={item.images[0].url} className='rounded-md w-full h-24 object-cover hover:scale-110 hover:duration-200' />
                                                : <div className='w-full h-24 bg-gray-200 rounded-md text-center flex items-center justify-center shadow'>
                                                    No Image
                                                </div>
                                        }
                                    </div>
                                    <div>
                                        <p className='font-bold'>{item.title}</p>
                                        <p className='text-sm text-gray-500'>{item.description}</p>
                                    </div>
                                </div>
                                {/* right */}
                                <div 
                                    onClick={() => actionRemoveProductOncart(item.id)}
                                    className='p-2 text-gray-500 hover:text-red-500 cursor-pointer hover:scale-110 transition-all hover:duration-200'>
                                    <Trash2 />
                                </div>
                            </div>
                            {/* Row 2 */}
                            <div className='flex justify-between'>
                                {/* left */}
                                <div className='border rounded-sm px-2 py-1'>
                                    <button
                                        onClick={() => actionUpdateQuantity(item.id, item.count - 1)}
                                        className='px-2 py-1 bg-gray-200 
                                        shadow-sm hover:bg-gray-300 transition-all hover:duration-200'>
                                        -
                                    </button>
                                    <span className='px-4'>{item.count}</span>
                                    <button
                                        onClick={() => actionUpdateQuantity(item.id, item.count + 1)}
                                        className='px-2 py-1 bg-gray-200
                            shadow-sm hover:bg-gray-300 transition-all hover:duration-200'>
                                        +
                                    </button>
                                </div>
                                {/* right */}
                                <div className='font-bold text-blue-500'>
                                    {item.price}
                                </div>
                            </div>
                        </div>
                    ))
                }
                {/* total */}
                <div className='flex justify-between px-2'>
                    <span>Total</span>
                    <span>{getTotalPrice()}</span>
                </div>
                {/* button */}
                <button className='mt-4 bg-blue-400 text-white  py-1 rounded-md w-full hover:bg-blue-500 transition-all hover:duration-200'>
                    Checkout
                </button>
            </div>
        </div>
    )
}

export default CartCard