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

    // useEffect(() => {
    //     let previousProductCount = null;

    //     const handleResize = () => {
    //         const width = window.innerWidth;
    //         const additionalProducts = Math.floor((width - 1080) / 200);
    //         const productCount = 4 + additionalProducts;

    //         if (productCount !== previousProductCount) {
    //             previousProductCount = productCount;
    //             loadData(productCount);
    //         }
    //     };

    //     window.addEventListener('resize', handleResize);
    //     handleResize(); // Initial load
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []);
    
    return (
        <div>
            <p className="text-2xl text-center my-3">Best seller!</p>
            <SwiperShowProduct>

                <div className='flex gap-14 items-center justify-center'>
                    {
                        products?.map((product, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <div >
                                        <div className='relative z-20'>
                                            <p className='z-10 absolute px-2 py-1 bg-red-400 shadow-md rounded-full right-1 top-1'>
                                                {product.sold}
                                                <span className='text-xs px-0.5'>
                                                    Sold!
                                                </span>
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

export default BestSellerProduct