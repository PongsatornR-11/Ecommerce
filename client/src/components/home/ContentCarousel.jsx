import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

const heroSlides = [
  {
    id: 1,
    badge: "New Release 2026",
    title: "Acoustic Perfection Everywhere",
    subtitle: "Experience studio-grade active noise cancellation and spatial sound with the all-new Nova Series.",
    cta: "Explore Smart Audio",
    categoryUrl: "/shop",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&auto=format&fit=crop&q=85",
    highlight: "40-Hour Battery • Hi-Res Audio",
  },
  {
    id: 2,
    badge: "Next-Gen Performance",
    title: "Precision Designed For Your Wrist",
    subtitle: "Continuous health staging, ECG heart monitoring, and titanium chassis built for endurance.",
    cta: "Discover Wearables",
    categoryUrl: "/shop",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&auto=format&fit=crop&q=85",
    highlight: "AMOLED Always-On • 50m Water Resistant",
  },
  {
    id: 3,
    badge: "Minimalist Workspace",
    title: "Elevate Your Creative Flow",
    subtitle: "Custom tuned mechanical switches with hot-swappable layout and ergonomic desktop acoustics.",
    cta: "Upgrade Workspace",
    categoryUrl: "/shop",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1400&auto=format&fit=crop&q=85",
    highlight: "Hot-Swappable 75% • Aluminum Frame",
  },
];

const ContentCarousel = () => {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <Swiper
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={true}
        modules={[Autoplay, Pagination]}
        className="rounded-3xl overflow-hidden shadow-2xl border border-slate-800/10 h-[480px] sm:h-[540px]"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative h-full w-full">
            {/* Background Image with Dark Gradient Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent z-10" />
            </div>

            {/* Content Box */}
            <div className="relative z-20 h-full flex flex-col justify-center max-w-xl px-8 sm:px-14 text-white">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-indigo-600/90 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-100 mb-4 w-fit shadow-md border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{slide.badge}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
                {slide.subtitle}
              </p>

              {/* Highlights & CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  to={slide.categoryUrl}
                  className="inline-flex items-center space-x-2 bg-white text-slate-950 hover:bg-indigo-50 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-white/20 active:scale-95"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-700/50">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {slide.highlight}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ContentCarousel;