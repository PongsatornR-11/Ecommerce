import React from 'react'
import { List } from 'lucide-react'
import useEcomStore from '../../store/ecom-store'
import { Link } from 'react-router-dom'
const ListCart = () => {

    const carts = useEcomStore((state) => state.carts)
    const getTotalPrice = useEcomStore((state) => state.getTotalPrice)
    return (
        <div className='bg-gray-100 p-4 rounded-sm'>
            {/* header */}
            <div className='flex items-center gap-2 mb-2'>
                <List size={24} />
                <p className='text-xl font-bold'>Summary {carts.length} items</p>
            </div>
            <hr />
            {/* list cart */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3 mt-2'>
                {/* left */}
                <div className='md:col-span-2'>
                    {/* Card */}
                    {carts.map((item, index) => (
                        <div key={index} className='bg-white p-2 rounded-md mb-2'>
                            {/* Row 1 */}
                            <div className='flex items-center justify-between mb-2'>
                                {/* left */}
                                <div className='flex gap-2 items-center'>

                                    {
                                        item.images && item.images.length > 0
                                            ? <img src={item.images[0].url} className='w-16 h-16 object-cover hover:scale-110 hover:duration-200' />
                                            : <div className='w-16 h-16 bg-gray-200 rounded-md text-center flex items-center justify-center shadow'>
                                                No Image
                                            </div>
                                    }

                                    <div>
                                        <p className='font-bold'>{item.title}</p>
                                        <p className='text-sm text-gray-500'>{item.price} x {item.count}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className='font-bold text-blue-500'>
                                        {item.price}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* right */}
                <div className='border p-2 rounded-md bg-white shadow-md space-y-2'>
                    <p className='text-xl font-bold'>Total price</p>
                    <div className='font-bold flex justify-between'>
                        <span>Net price</span>
                        <span className='text-xl'><span>฿ </span>{getTotalPrice()}</span>
                    </div>

                    <div className='space-y-2'>
                        <Link to='/shop'>
                            <button className='w-full bg-gray-200 shadow-md text-gray-500 px-2 py-1 rounded-md hover:bg-gray-300 transition-all hover:duration-200'>
                                Edit
                            </button>
                        </Link>
                        <button className='w-full bg-blue-400 shadow-md text-white px-2 py-1 rounded-md hover:bg-blue-500 transition-all hover:duration-200'>
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListCart