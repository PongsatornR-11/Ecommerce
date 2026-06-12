import React, { useEffect, useState } from 'react'
import useEcomStore from '../../store/ecom-store'
import ProductCard from '../card/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/pagination';
import "swiper/css/navigation"
import { Autoplay, Scrollbar, Navigation } from 'swiper/modules';

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col items-center justify-center text-center mb-8">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 mb-1">Explore More</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Our Collection</h2>
                <div className="w-12 h-1 bg-indigo-600 rounded-full mt-3"></div>
            </div>

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
                navigation={true}
                modules={[Scrollbar, Autoplay, Navigation]}
                className="mySwiper rounded-2xl overflow-hidden"
            >
                {
                    products?.map((product, index) => {
                        return (
                            <SwiperSlide key={index} className='p-4 pb-6'>
                                <ProductCard key={index} product={product} />
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </div>
    )
}

export default ProductCarousel;