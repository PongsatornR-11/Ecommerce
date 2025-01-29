import React, { useState, useEffect } from 'react'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';
import axios from 'axios';

const ContentCarousel = () => {

    const [Images, setImages] = useState([])
    useEffect(()=>{
        hdlGetImage()
    },[])
    const hdlGetImage = async () =>{
        // await axios.get('https://api.unsplash.com/photos/random?count=10&client')
        await axios.get('https://picsum.photos/v2/list?page=1&limit=15')
        .then((res)=>{
            setImages(res.data)
            console.log(Images)
        })
        .catch(err => console.log(err))
    }



    return (
        <div><Swiper pagination={true} modules={[Pagination]} className="mySwiper">
            <SwiperSlide>Slide 1</SwiperSlide>
            <SwiperSlide>Slide 2</SwiperSlide>
            <SwiperSlide>Slide 3</SwiperSlide>
            <SwiperSlide>Slide 4</SwiperSlide>
            <SwiperSlide>Slide 5</SwiperSlide>
            <SwiperSlide>Slide 6</SwiperSlide>
            <SwiperSlide>Slide 7</SwiperSlide>
            <SwiperSlide>Slide 8</SwiperSlide>
            <SwiperSlide>Slide 9</SwiperSlide>
        </Swiper></div>
    )
}

export default ContentCarousel