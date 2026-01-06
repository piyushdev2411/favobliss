"use client";

import React from "react";
import Image from "next/image";
import { LocationGroup, Product } from "@/types";
import { ProductCard } from "./product-card";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

interface Props {
  bannerImage: string;
  products: any[];
  locationGroups: LocationGroup[];
}

const BannerProductSection = (props: Props) => {
  const {
    bannerImage = "/api/placeholder/300/400",
    products,
    locationGroups,
  } = props;

  return (
    <div className="w-full bg-[#292928] py-2 md:py-2 rounded-3xl pr-2">
      <div className="max-w-full mx-auto px-2">
        <div className="lg:hidden flex flex-col gap-5">
          <div className="w-full h-[375px]">
            <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden">
              <Image
                src={bannerImage}
                alt="Banner"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>

          <Swiper
            className="w-full"
            modules={[FreeMode, Mousewheel]}
            freeMode={true}
            mousewheel={true}
            slidesPerView="auto"
            spaceBetween={2}
            grabCursor={true}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="flex-shrink-0 w-[160px] max-w-[200px]">
                <ProductCard data={product} locationGroups={locationGroups} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="hidden lg:flex gap-6 h-[375px]">
          {/* Left Banner - Fixed */}
          <div className="flex-shrink-0 w-[300px] xl:w-[350px]">
            <div className="relative w-full h-[375px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden">
              <Image
                src={bannerImage}
                alt="Banner"
                fill
                className="object-cover"
                sizes="350px"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Products on right for desktop - using Swiper */}
            <Swiper
              className="h-[375px] w-full"
              modules={[FreeMode, Mousewheel]}
              freeMode={true}
              mousewheel={true}
              slidesPerView="auto"
              spaceBetween={4}
              grabCursor={true}
            >
              {products.map((product) => (
                <SwiperSlide
                  key={product.id}
                  className="h-full flex-shrink-0 w-full max-w-[200px] xl:max-w-[260px]"
                >
                  <ProductCard data={product} locationGroups={locationGroups} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerProductSection;
