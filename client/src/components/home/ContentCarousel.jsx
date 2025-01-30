import React, { useState, useEffect } from 'react'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, Pagination } from 'swiper/modules';
import axios from 'axios';

const ContentCarousel = () => {

    const [Images, setImages] = useState([])
    useEffect(() => {
        hdlGetImage()
    }, [])
    const hdlGetImage = async () => {
        // await axios.get('https://api.unsplash.com/photos/random?count=10&client')
        await axios.get('https://picsum.photos/v2/list?page=1&limit=15')
            .then((res) => {
                setImages(res.data)
                console.log(Images)
            })
            .catch(err => console.log(err))
    }

    return (
        <div>
            <Swiper
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{clickable: true,}}
                modules={[Pagination, Autoplay]} className="mySwiper h-80 object-cover">
                {
                    Images?.map((image) => {
                        return (
                            <SwiperSlide key={image.id}>
                                {/* <img src={`${image.url}`} /> */}
                                <img src={`${image.download_url}`} />
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </div>
    )
}

export default ContentCarousel