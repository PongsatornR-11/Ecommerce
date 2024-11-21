import React from 'react'
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <div className='border rounded-md shadow-md p-2 w-48'>
            <div>
                {
                    product.images && product.images.length > 0
                        ? <img src={product.images[0].url} className='rounded-md w-full h-24 object-cover hover:scale-110 hover:duration-200'/>
                        : <div className='w-full h-24 bg-gray-200 rounded-md text-center flex items-center justify-center shadow'>
                            No Image
                        </div>
                }

            </div>

            <div className='py-2'>
                <p className='text-xl font-bold'>{product.title}</p>
                <p className='text-sm text-gray-600'>{product.description}</p>
            </div>

            <div className='flex justify-between items-end p-1'>
                <span className='text-sm font-bold '>{product.price}</span>
                <button className='bg-blue-200 rounded-md p-2 hover:bg-blue-600 shadow-sm hover:duration-500 hover:text-white'><ShoppingCart /></button>
            </div>
        </div>
    )
}
export default ProductCard