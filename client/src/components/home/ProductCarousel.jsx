import React, { useEffect, useState } from 'react'
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

    const [slidesPerView, setSlidesPerView] = useState(4);

    const calSlidePerView = () => {
        const width = window.innerWidth
        const calSlide = Math.floor(width / 200)
        return calSlide
    }

    useEffect(() => {
        const handleResize = () => {
            setSlidesPerView(calSlidePerView());
        }

        window.addEventListener('resize', handleResize)
        setSlidesPerView(calSlidePerView())

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div className='my-2'>

            <p className='text-2xl text-center mt-5'>Other products!</p>
            <Swiper
                slidesPerView={slidesPerView}
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