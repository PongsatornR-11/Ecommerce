import React, { useEffect, useState } from 'react'
import { listProductBy } from '../../api/product'
import ProductCard from '../card/ProductCard'

import { formatHour } from '../../utils/datetimeformat'

import SwiperShowProduct from '../../utils/SwiperShowProduct'
import { SwiperSlide } from 'swiper/react'

const NewProduct = () => {

    const [products, setProducts] = useState([])

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        await listProductBy('updatedAt', 'desc', 10)
            .then((res) => {
                setProducts(res.data)
                console.log(products)
            })
            .catch(err => console.log(err))
    }

    return (
        <div>
            <p className='text-2xl text-center my-3'>NewProduct!</p>
            <SwiperShowProduct>
                <div className='flex gap-14 items-center justify-center'>
                    {
                        products.map((product, index) => {
                            return (
                                <SwiperSlide key={index} >

                                    <div >
                                        <div className='relative z-20'>
                                            <p className='z-10 absolute px-2 py-1 bg-green-300 shadow-md rounded-xl right-1 top-1'>
                                                {formatHour(product.updatedAt)}
                                            </p>
                                        </div>
                                        <ProductCard product={product} />
                                    </div>

                                </SwiperSlide>
                            )
                        })
                    }
                </div>
            </SwiperShowProduct>
        </div>
    )
}

export default NewProduct