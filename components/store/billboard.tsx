"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules"; // Modular imports to keep bundle small
import "swiper/css"; // Core CSS (minimal)
import "swiper/css/navigation"; // Only if using arrows
import "swiper/css/autoplay"; // Only if using autoplay

const HeroSlider: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const slides = [
    {
      id: 1,
      src: "/assets/hero/banner-1.webp",
      alt: "Best Television India",
      width: 1000,
      height: 340,
      priority: true,
    },
    // Add more here later
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
      <div className="relative w-full aspect-[3/1] max-h-[600px] bg-transparent hidden md:block px-4 md:px-6 border-0">
        <Image
          src="/assets/hero/banner-1.webp"
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
    <section className="relative w-full hidden md:block">
      <div className="relative w-full aspect-[3/1] max-h-[600px] overflow-hidden px-4 md:px-6 border-0">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          navigation={{
            nextEl: ".swiper-next",
            prevEl: ".swiper-prev",
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
                className="w-full h-full object-fill object-center"
                priority={slide.priority || false}
                loading="eager"
                sizes="100vw"
              />
              {/* Optional overlay */}
              <div className="absolute inset-0 bg-black/5 z-[1] border border-transparent" />
            </SwiperSlide>
          ))}
          {/* Custom arrows */}
          <div className="swiper-prev absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-lg cursor-pointer z-10 hover:bg-white transition-all duration-200">
            <ChevronLeft size={20} className="text-gray-800 sm:w-6 sm:h-6" />
          </div>
          <div className="swiper-next absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-lg cursor-pointer z-10 hover:bg-white transition-all duration-200">
            <ChevronRight size={20} className="text-gray-800 sm:w-6 sm:h-6" />
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default HeroSlider;


/*

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const HeroSlider: React.FC = () => {
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const [SliderComponent, setSliderComponent] = useState<React.ComponentType<any> | null>(null);

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
      src: "/assets/hero/banner-1.webp",
      alt: "Best Television India",
      width: 1000,
      height: 340,
      priority: true,
    },
    // {
    //   id: 2,
    //   src: "/assets/hero/banner-2.webp",
    //   alt: "Best Television India",
    //   width: 1000,
    //   height: 340,
    // },
  ];

  useEffect(() => {
    // Load the slider library
    import("react-slick").then((mod) => {
      setSliderComponent(() => mod.default);
    });
  }, []);

  useEffect(() => {
    const loadImages = slides.map((slide) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.src = slide.src;
        img.onload = resolve;
        img.onerror = resolve; // Handle errors gracefully
      });
    });

    Promise.all(loadImages).then(() => setIsImagesLoaded(true));
  }, []);

  const isFullyLoaded = isImagesLoaded && SliderComponent;

  if (!isFullyLoaded) {
    return (
      <div className="relative w-full aspect-[3/1] max-h-[600px] bg-transparent hidden md:block px-4 md:px-6 border-0">
        <Image
          src="/assets/hero/banner-1.webp"
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
    <section className="relative w-full hidden md:block">
      <div className="relative w-full aspect-[3/1] max-h-[600px] overflow-hidden px-4 md:px-6 border-0">
        {SliderComponent && (
          <SliderComponent {...settings} className="h-full w-full">
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

                  <div className="absolute inset-0 bg-black/5 z-[1] border border-transparent rounded-2xl" />
                </div>
              </div>
            ))}
          </SliderComponent>
        )}

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

export default HeroSlider;
*/
