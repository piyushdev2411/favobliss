"use client";

import React from "react";
import Image from "next/image";
import { HomePageCategoryProduct, LocationGroup, Product } from "@/types";
import { ProductCard } from "./product-card";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

interface Props {
  products: HomePageCategoryProduct[] | undefined;
  locationGroups: LocationGroup[];
}

const PromtionalBannerProducts = (props: Props) => {
  const { products, locationGroups } = props;

  return (
    <div className="w-full bg-transparent py-2 md:py-2 rounded-3xl pr-2">
      <div className="max-w-full mx-auto px-2">
        <div className="lg:hidden flex flex-col gap-5">
          <Swiper
            className="w-full"
            modules={[FreeMode, Mousewheel]}
            freeMode={true}
            mousewheel={true}
            slidesPerView="auto"
            spaceBetween={2}
            grabCursor={true}
          >
            {products?.map((product) => (
              <SwiperSlide
                key={product.id}
                className="flex-shrink-0 w-[160px] max-w-[200px]"
              >
                <ProductCard data={product.product} locationGroups={locationGroups} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="hidden lg:flex gap-6 h-[375px]">

          <div className="flex-1 min-w-0">
            <Swiper
              className="h-[375px] w-full"
              modules={[FreeMode, Mousewheel]}
              freeMode={true}
              mousewheel={true}
              slidesPerView="auto"
              spaceBetween={4}
              grabCursor={true}
            >
              {products?.map((product) => (
                <SwiperSlide
                  key={product.id}
                  className="h-full flex-shrink-0 w-full max-w-[200px] xl:max-w-[260px]"
                >
                  <ProductCard data={product.product} locationGroups={locationGroups} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromtionalBannerProducts;
