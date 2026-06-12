import React, { useEffect, useState } from 'react'
import { listProductBy } from '../../api/product'
import ProductCard from '../card/ProductCard'
import SwiperShowProduct from '../../utils/SwiperShowProduct'
import { SwiperSlide } from 'swiper/react'

const BestSellerProduct = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        loadData()
    }, [])

    const loadData = () => {
        listProductBy('sold', 'desc', 10)
            .then((res) => {
                setProducts(res.data)
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col items-center justify-center text-center mb-8">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 mb-1">Trending Now</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Best Sellers</h2>
                <div className="w-12 h-1 bg-indigo-600 rounded-full mt-3"></div>
            </div>

            <SwiperShowProduct>
                {products?.map((product, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative pt-2 px-1 pb-4">
                            <span className="absolute top-4 right-3 z-10 px-2 py-0.5 rounded-lg bg-rose-500 text-[10px] font-bold text-white shadow-sm shadow-rose-200">
                                {product.sold} Sold
                            </span>
                            <ProductCard product={product} />
                        </div>
                    </SwiperSlide>
                ))}
            </SwiperShowProduct>
        </div>
    )
}

export default BestSellerProduct;