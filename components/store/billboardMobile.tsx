"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
});

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-lg cursor-pointer z-10 hover:bg-white transition-all duration-200"
      onClick={onClick}
    >
      <ChevronRight size={20} className="text-gray-800 sm:w-6 sm:h-6" />
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-lg cursor-pointer z-10 hover:bg-white transition-all duration-200"
      onClick={onClick}
    >
      <ChevronLeft size={20} className="text-gray-800 sm:w-6 sm:h-6" />
    </div>
  );
};

const HeroSliderMobile: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    fade: false,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: false,
          autoplaySpeed: 5000,
        },
      },
    ],
  };

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
        img.onerror = resolve;
      });
    });

    Promise.all(loadImages).then(() => setIsLoaded(true));
  }, []);

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
      <div className="relative w-full aspect-[3/1] max-h-[600px] overflow-hidden px-4 md:px-6 border-0 h-[200px]">
        <Slider {...settings} className="h-full">
          {slides.map((slide) => (
            <div key={slide.id} className="relative w-full h-full">
              <div className="relative w-full h-full">
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

                {/* Optional overlay */}
                <div className="absolute inset-0 bg-black/5 z-[1] border border-transparent rounded-2xl" />
              </div>
            </div>
          ))}
        </Slider>

        {/* Custom dots styling */}
        <style jsx global>{`
          .slick-dots {
            bottom: 20px !important;
            z-index: 20 !important;
          }

          .slick-dots li button:before {
            font-size: 12px !important;
            color: white !important;
            opacity: 0.7 !important;
          }

          .slick-dots li.slick-active button:before {
            opacity: 1 !important;
            color: white !important;
          }

          @media (max-width: 640px) {
            .slick-dots {
              bottom: 15px !important;
            }

            .slick-dots li button:before {
              font-size: 10px !important;
            }
          }

          /* Ensure slider container maintains aspect ratio */
          .slick-slider,
          .slick-list,
          .slick-track {
            height: 100% !important;
          }

          .slick-slide > div {
            height: 100% !important;
          }
          .slick-slide {
            transition: opacity 0.5s linear;
          }
        `}</style>
      </div>
    </section>
  );
};

export default HeroSliderMobile;
