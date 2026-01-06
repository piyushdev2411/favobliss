"use client";

import { Brand } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import Link from "next/link";

interface Props {
  brands: Brand[];
}

const BrandList = ({ brands }: Props) => {
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(`/brand/${path}?page=1`);
  };

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <div className="bg-transparent py-8 md:py-12">
      <div className="px-4 text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          Explore Official Brand Stores
        </h2>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <Swiper
          className="w-full"
          modules={[FreeMode, Mousewheel]}
          freeMode={true}
          mousewheel={true}
          slidesPerView="auto"
          spaceBetween={16}
          grabCursor={true}
        >
          {brands.map((item) => (
            <SwiperSlide
              key={item.id}
              className="flex-shrink-0 w-[13.33%] min-w-[60px] max-w-[80px] md:min-w-[120px] md:max-w-[160px]"
            >
              <div className="flex flex-col items-center space-y-2">
                <Link href={`/brand/${item.slug}?page=1`}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center rounded-full overflow-hidden cursor-pointer p-1 md:p-2"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={item.cardImage || "/placeholder-brand.png"}
                      alt={item.name || "Brand"}
                      fill
                      sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                      className="object-contain p-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-brand.png";
                      }}
                    />
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BrandList;
