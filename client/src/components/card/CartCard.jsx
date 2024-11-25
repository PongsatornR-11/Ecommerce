import React from 'react'
import { Trash2, Minus, Plus } from 'lucide-react';

const CartCard = () => {


    return (
        <div>
            <h1 className='text-xl font-bold'>Cart</h1>
            {/* Border */}
            <div className='border p-2'>
                {/* Card */}
                <div className='bg-white p-2 rounded-md'>
                    {/* Row 1 */}
                    <div className='flex items-center justify-between mb-2'>
                        {/* left */}
                        <div className='flex gap-2 items-center'>
                            <div className='w-16 h-16 bg-gray-200 rounded-md flex items-center text-center' >
                                No Image
                            </div>
                            <div>
                                <p className='font-bold'>Title</p>
                                <p className='text-sm text-gray-500'>description</p>
                            </div>
                        </div>
                        {/* right */}
                        <div className='p-2 text-gray-500 hover:text-red-500 cursor-pointer hover:scale-110 transition-all hover:duration-200'>
                            <Trash2 />
                        </div>
                    </div>
                    {/* Row 2 */}
                    <div className='flex justify-between'>
                        {/* left */}
                        <div className='border rounded-sm px-2 py-1'>
                            <button className='px-2 py-1 bg-gray-200 
                            shadow-sm hover:bg-gray-300 transition-all hover:duration-200'>-</button>
                            <span className='px-4'>1</span>
                            <button className='px-2 py-1 bg-gray-200
                            shadow-sm hover:bg-gray-300 transition-all hover:duration-200'>
                                +
                            </button>
                        </div>
                        {/* right */}
                        <div className='font-bold text-blue-500'>
                            1,000
                        </div>
                    </div>
                </div>

                {/* total */}
                <div className='flex justify-between px-2'>
                    <span>Total</span>
                    <span>5,000</span>
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