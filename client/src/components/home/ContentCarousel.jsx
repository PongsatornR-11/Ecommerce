import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ContentCarousel = () => {
    const [Images, setImages] = useState([])
    useEffect(() => {
        hdlGetImage()
    }, [])
    
    const hdlGetImage = async () => {
        await axios.get('https://picsum.photos/v2/list?page=1&limit=5')
            .then((res) => {
                setImages(res.data)
            })
            .catch(err => console.log(err))
    }

    const heroTexts = [
        { title: "Redefine Your Workspace", subtitle: "Explore our collection of mechanical keyboards, premium mice, and high-quality accessories." },
        { title: "Next-Gen Performance", subtitle: "Power up your productivity with state-of-the-art laptops and powerful desktop workstations." },
        { title: "Immersive Visuals", subtitle: "Experience sharp details and vivid colors with professional grade 4K UHD monitors." },
        { title: "Console & Casual Gaming", subtitle: "Level up your gaming experience with top-tier consoles and accessories." },
        { title: "Seamless Digital Lifestyle", subtitle: "Fast, reliable components designed to power your daily creative workflow." }
    ];

    return (
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Swiper
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                }}
                pagination={{ 
                    clickable: true,
                    dynamicBullets: true
                }}
                navigation={true}
                modules={[Pagination, Autoplay, Navigation]} 
                className="mySwiper h-[400px] w-full rounded-3xl overflow-hidden shadow-md border border-slate-100"
            >
                {
                    Images?.map((image, index) => {
                        const text = heroTexts[index % heroTexts.length];
                        return (
                            <SwiperSlide key={image.id} className="relative w-full h-full">
                                {/* Image background */}
                                <img 
                                    src={`${image.download_url}`} 
                                    alt="Hero background"
                                    className="w-full h-full object-cover filter brightness-[0.8]"
                                />
                                
                                {/* Overlay Mask */}
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent z-10" />
                                
                                {/* Floating Content */}
                                <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 sm:px-16 md:px-24 max-w-2xl text-white">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="space-y-4"
                                    >
                                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/85 backdrop-blur-sm border border-indigo-400/30 text-[10px] font-bold uppercase tracking-wider">
                                            Featured Collection
                                        </span>
                                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                                            {text.title}
                                        </h1>
                                        <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed">
                                            {text.subtitle}
                                        </p>
                                        <div className="pt-2">
                                            <Link 
                                                to="/shop"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-xs hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all"
                                            >
                                                <span>Shop Collection</span>
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </motion.div>
                                </div>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </div>
    )
}

export default ContentCarousel;