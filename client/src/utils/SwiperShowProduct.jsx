import React, { useEffect, useState } from 'react'
import { Swiper } from 'swiper/react'

// import Swiper styles
import "swiper/css"
// import "swiper/css/pagination"
import 'swiper/css/scrollbar';
import "swiper/css/navigation"

// import required modules
import { Pagination, Autoplay, Navigation, Scrollbar } from 'swiper/modules'

const SwiperShowProduct = ({ children }) => {

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
        <div>
            <Swiper
                slidesPerView={slidesPerView}
                spaceBetween={50}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                // pagination={{
                //     clickable: true,
                // }}
                scrollbar={{
                    hide: true,
                }}
                navigation={true}
                modules={[Scrollbar, Autoplay, Navigation]}
                className="mySwiper object-cover rounded-md"
            >
                {children}

            </Swiper>
        </div>
    )
}

export default SwiperShowProduct