"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { HomepageCategory } from "@/types";
import { useState } from "react";

interface Props {
  categories: HomepageCategory[];
  categoryChange: (id: string) => void;
}

const CategoryButtons = ({ categories, categoryChange }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || "" );

  const handleCategoryClick = (id: string) => {
    setSelectedCategory(id);
    categoryChange(id);
  }

  return (
    <div className="w-full max-w-7xl ml-[10px]">
      <Swiper
        className="w-full"
        modules={[FreeMode, Mousewheel]}
        freeMode={true}
        mousewheel={true}
        slidesPerView="auto"
        spaceBetween={12} 
        grabCursor={true}
        simulateTouch={true}
        touchStartPreventDefault={false}
        preventClicks={false}
        preventClicksPropagation={false}
      >
        {categories.map((category, index) => (
          <SwiperSlide
            key={index}
            className="flex-shrink-0 w-auto min-w-fit max-w-fit md:max-w-[180px]"
          >
            <button
              className={`rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2 font-medium transition-colors duration-200 shadow-sm border text-sm sm:text-base truncate w-full ${selectedCategory === category.id ? 'bg-[#fb8142] border-[#fb8142] hover:bg-[#fb8142] text-white' : 'bg-white border-gray-200 hover:bg-white text-gray-800'}`}
              onClick={() => handleCategoryClick(category.id)}
              title={category.name}
            >
              {category.name}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryButtons;
