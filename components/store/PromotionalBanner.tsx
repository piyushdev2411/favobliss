"use client";

import {
  HomepageCategory,
  HomePageCategoryProduct,
  LocationGroup,
} from "@/types";
import React, { useEffect, useState } from "react";
import { ProductSkeleton } from "./product-skeleton";
import CategoryButtons from "./CategoryButtons";
import PromtionalBannerProducts from "./PromotionalBannerProducts";
import { getHomepageCategoryById } from "@/actions/get-homepage-categories";

interface Props {
  locationGroups: LocationGroup[];
  categories: HomepageCategory[];
}

const PromotionalBanner = (props: Props) => {
  const { locationGroups, categories } = props;
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState<string>("first");
  const [product, setProduct] = useState<HomePageCategoryProduct[] | undefined>(
    []
  );

  const categoryChange = (id: string) => {
    setCategory(id);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const productsData = await getHomepageCategoryById(category);
      //@ts-ignore
      setProduct(productsData.products);
      setLoading(false);
    };
    getData();
  }, [category]);

  return (
    <div className="w-full max-w-full mx-auto">
      <div
        className="relative rounded-3xl sm:rounded-2xl lg:rounded-3xl overflow-hidden 
             bg-center bg-no-repeat flex items-end 
             min-h-[40vh] sm:min-h-[80vh] lg:min-h-[120vh] 
             p-3 sm:p-4 lg:p-5 
             bg-[#f8cabb] md:bg-[url('http://res.cloudinary.com/dgcksrb1n/image/upload/v1754593480/w4gd7muiyubkbusexs2z.jpg')] md:bg-cover"
      >
        <div className="w-full px-2 sm:px-3 lg:px-0">
          <div className="mb-4 sm:mb-6 w-full">
            {/* <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category, index) => (
                <button
                  className="bg-white rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2 text-gray-800 font-medium hover:bg-gray-100 transition-colors duration-200 shadow-sm border border-gray-200 whitespace-nowrap text-sm sm:text-base flex-shrink-0 min-w-fit md:min-w-[150px]"
                  key={index}
                  onClick={() => categoryChange(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div> */}
            <CategoryButtons
              categories={categories}
              categoryChange={categoryChange}
            />
          </div>

          {loading ? (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide md:grid md:grid-cols-4 md:overflow-y-hidden max-h-[360px]">
              <ProductSkeleton className="w-[160px] sm:w-[unset] flex-shrink-0 h-[270px] md:h-[unset]" />
              <ProductSkeleton className="w-[160px] sm:w-[unset] flex-shrink-0 h-[270px]" />
              <ProductSkeleton className="w-[160px] sm:w-[unset] flex-shrink-0 h-[270px]" />
              <ProductSkeleton className="w-[160px] sm:w-[unset] flex-shrink-0 h-[270px]" />
            </div>
          ) : (
            <PromtionalBannerProducts
              products={product}
              locationGroups={locationGroups}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;
