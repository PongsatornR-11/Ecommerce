import React from 'react'
import { ShoppingCart } from 'lucide-react';
import useEcomStore from '../../store/ecom-store';
import { formatPrice } from '../../utils/number';

const ProductCard = ({ product }) => {
    const actionAddCart = useEcomStore((state) => state.actionAddCart)
    
    return (
        <div className='border rounded-md shadow-md p-2 w-48 h-[280px] flex flex-col'>
            <div>
                {
                    product.images && product.images.length > 0
                        ? <img src={product.images[0].url} className='rounded-md w-full h-32 object-cover hover:scale-110 hover:duration-200'/>
                        : <div className='w-full h-32 bg-gray-200 rounded-md text-center flex items-center justify-center shadow'>
                            No Image
                        </div>
                }
            </div>

            <div className='py-2 flex-1'>
                <p className='text-base font-bold truncate'>{product.title}</p>
                <p className='text-sm text-gray-600 line-clamp-2'>
                    {product.description}
                </p>
            </div>

            <div className='flex justify-between items-end p-1'>
                <span className='text-sm font-bold '>{formatPrice(product.price)} THB</span>
                <button 
                onClick={() => actionAddCart(product)}
                className='bg-blue-300 rounded-md p-2 hover:bg-blue-500 shadow-sm hover:duration-500 hover:text-white'
                ><ShoppingCart />
                </button>
            </div>
        </div>
    )
}
export default ProductCard