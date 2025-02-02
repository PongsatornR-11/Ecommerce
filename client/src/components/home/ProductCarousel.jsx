import React, { useEffect } from 'react'
import useEcomStore from '../../store/ecom-store'
import ProductCard from '../card/ProductCard';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, Scrollbar } from 'swiper/modules';


const ProductCarousel = () => {
    const getProducts = useEcomStore((state) => state.getProduct)
    const products = useEcomStore((state) => state.products)

    useEffect(() => {
        getProducts()
    }, [])

    return (
        <div className='my-2'>
            p
            <Swiper
                slidesPerView={5}
                spaceBetween={50}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                scrollbar={{
                    hide: true,
                }}
                modules={[Scrollbar, Autoplay]}
                className="mySwiper"
            >
                {
                    products?.map((product, index) => {
                        return (
                            <SwiperSlide key={index} className='p-4'>
                                <ProductCard key={index} product={product} />
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </div>
    )
}

export default ProductCarousel