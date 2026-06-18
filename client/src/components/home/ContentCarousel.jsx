import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import axios from 'axios';
import { ArrowRight, Truck, ShieldCheck, Headphones, Award } from 'lucide-react';
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

    const benefits = [
        {
            icon: <Truck size={20} />,
            title: "Free Delivery",
            desc: "For orders over 1,500 THB"
        },
        {
            icon: <ShieldCheck size={20} />,
            title: "Secure Checkout",
            desc: "100% SSL secure payments"
        },
        {
            icon: <Headphones size={20} />,
            title: "24/7 Premium Support",
            desc: "Dedicated helpdesk assistance"
        },
        {
            icon: <Award size={20} />,
            title: "Official Warranty",
            desc: "100% genuine product guarantee"
        }
    ];

    return (
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
                className="mySwiper h-[360px] sm:h-[420px] w-full rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800/80 transition-colors duration-200"
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
                                    className="w-full h-full object-cover filter brightness-[0.75]"
                                />
                                
                                {/* Overlay Mask */}
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/40 to-transparent z-10" />
                                
                                {/* Floating Content */}
                                <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-16 md:px-24 max-w-2xl text-white">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="space-y-3 sm:space-y-4"
                                    >
                                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/85 backdrop-blur-sm border border-indigo-400/30 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                                            Featured Collection
                                        </span>
                                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                                            {text.title}
                                        </h1>
                                        <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed max-w-md">
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

            {/* Benefits Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {benefits.map((item, index) => (
                    <div 
                        key={index}
                        className="glass dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/70 p-4.5 rounded-2xl flex items-center gap-4 hover:scale-102 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 shadow-sm"
                    >
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex-none">
                            {item.icon}
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide truncate">{item.title}</h4>
                            <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5 truncate">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ContentCarousel;