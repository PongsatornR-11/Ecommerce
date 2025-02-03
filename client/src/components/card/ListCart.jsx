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
        <div className='bg-gray-100 p-4 rounded-sm'>
            {/* header */}
            <div className='flex justify-between items-center gap-2 mb-2'>
                <div className='flex items-center'>
                    <List size={24} />
                    <p className='text-xl font-bold px-2'>Summary {cart.length} {cart.length > 1 ? 'items' : 'item'} </p>
                </div>
                <span>{useCurrentTime()}</span>
            </div>
            <hr />
            {/* list cart */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3 mt-2'>
                {/* left */}
                <div className='md:col-span-2'>
                    {/* Card */}
                    {cart.map((item, index) => (
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
                                        <p className='text-sm text-gray-500'>{formatPrice(item.price)} THB x {item.count}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className='font-bold text-blue-500'>
                                        {formatPrice(item.price * item.count)} THB
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
                        <span>NET PRICE</span>
                        <span className='text-xl'>{formatPrice(getTotalPrice())} THB</span>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <Link to='/shop'>
                            <button className='w-full bg-gray-200 shadow-md text-gray-500 px-2 py-1 rounded-md hover:bg-gray-300 transition-all hover:duration-200'>
                                Edit
                            </button>
                        </Link>

                        {user
                            ? <Link>
                                <button
                                    disabled={cart.length < 1}
                                    onClick={handleCheckout}
                                    className='w-full bg-green-400 shadow-md text-white px-2 py-1 rounded-md hover:bg-green-500 transition-all hover:duration-200'>
                                    Checkout
                                </button>
                            </Link>
                            : <Link to='/login'>
                                <button className='w-full bg-blue-400 shadow-md text-white px-2 py-1 rounded-md hover:bg-blue-500 transition-all hover:duration-200'>
                                    login
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