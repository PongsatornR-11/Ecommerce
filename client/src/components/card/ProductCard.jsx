import React from 'react'
import { ShoppingCart } from 'lucide-react';

const ProductCard = () => {
    return (
        <div className='border rounded-md shadow-md p-2 w-48'>
            <div>
                <div className='w-full h-24 bg-gray-200 rounded-md text-center flex items-center justify-center shadow'>
                    No Image
                </div>
            </div>

            <div className='py-2'>
                <p className='text-xl font-bold'>Title</p>
                <p className='text-sm text-gray-600'>description</p>
            </div>

            <div className='flex justify-between items-end p-1'>
                <span className='text-sm font-bold '>15,900</span>
                <button className='bg-blue-200 rounded-md p-2 hover:bg-blue-600 shadow-sm hover:duration-500 hover:text-white'><ShoppingCart /></button>
            </div>
        </div>
    )
}
export default ProductCard