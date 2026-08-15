import React from "react";
import { Swiper } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SwiperShowProduct = ({ children }) => {
  return (
    <div className="relative py-4 px-2">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 28,
          },
        }}
        className="product-swiper !pb-12"
      >
        {children}
      </Swiper>
    </div>
  );
};

export default SwiperShowProduct;