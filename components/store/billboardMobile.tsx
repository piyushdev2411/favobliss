"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

// Import only needed modules + minimal CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const HeroSliderMobile: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const slides = [
    {
      id: 1,
      src: "/assets/hero/banner-boat.jpg",
      alt: "Best Television India",
      width: 1000,
      height: 340,
      priority: true,
    },
    // {
    //   id: 2,
    //   src: "/assets/hero/banner-boat-2.jpg",
    //   alt: "Best Television India",
    //   width: 1000,
    //   height: 340,
    // },
  ];

  useEffect(() => {
    const loadImages = slides.map((slide) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.src = slide.src;
        img.onload = resolve;
        img.onerror = resolve; // continue even if error
      });
    });

    Promise.all(loadImages).then(() => setIsLoaded(true));
  }, []);

  // Show first image as placeholder while loading
  if (!isLoaded) {
    return (
      <div className="relative w-full aspect-[3/1] max-h-[600px] bg-transparent md:hidden block px-4 md:px-6 border-0">
        <Image
          src="/assets/hero/banner-boat.jpg"
          alt="Best Television India"
          width={1000}
          height={340}
          className="w-full h-full object-fill object-center rounded-2xl"
          priority
          fetchPriority="high"
          sizes="100vw"
        />
      </div>
    );
  }

  return (
    <section className="relative w-full block md:hidden">
      <div className="relative w-full aspect-[3/1] max-h-[600px] overflow-hidden px-4 md:px-6 border-0">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}                    // important for smooth infinite
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            nextEl: ".mobile-swiper-next",
            prevEl: ".mobile-swiper-prev",
          }}
          className="h-full w-full rounded-2xl"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              <Image
                src={slide.src}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                className="w-full h-full object-fill object-center rounded-2xl"
                priority={slide.priority || false}
                loading="eager"
                sizes="100vw"
              />
              {/* Optional dark overlay */}
              <div className="absolute inset-0 bg-black/5 z-[1] border border-transparent rounded-2xl" />
            </SwiperSlide>
          ))}

          {/* Custom navigation arrows */}
          <div className="mobile-swiper-prev absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-lg cursor-pointer z-10 hover:bg-white transition-all duration-200">
            <ChevronLeft size={20} className="text-gray-800 sm:w-6 sm:h-6" />
          </div>

          <div className="mobile-swiper-next absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-lg cursor-pointer z-10 hover:bg-white transition-all duration-200">
            <ChevronRight size={20} className="text-gray-800 sm:w-6 sm:h-6" />
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default HeroSliderMobile;