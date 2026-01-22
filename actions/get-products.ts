// actions/get-products.ts
"use server";

import { cache } from "react";
import { Product } from "@/types";
import {
  hotDeals,
  productById,
  productBySlug,
  productsList,
  recentlyViewedProducts,
} from "@/data/functions/product";
import { unstable_cache } from "next/cache";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

interface ProductQuery {
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  limit?: number | string;
  page?: number;
  type?: "MEN" | "WOMEN" | "KIDS" | "BEAUTY" | "ELECTRONICS";
  price?: string;
  variantIds?: string[];
  pincode?: number;
  rating?: string;
  discount?: string;
  locationGroupId?: string;
  selectFields?: string[];
}

interface HotDealsQuery extends ProductQuery {
  timeFrame?: "7 days" | "30 days" | "90 days" | "all time";
}

const productQueryKey = (query: ProductQuery) =>
  `products-${JSON.stringify(query)}`;
const hotDealsKey = (query: HotDealsQuery) =>
  `hot-deals-${JSON.stringify(query)}`;
const productSlugKey = (slug: string) => `product-slug-${slug}`;
const productIdKey = (id: string) => `product-id-${id}`;
const recentlyViewedKey = (productIds: string[], locationGroupId?: string) =>
  `recently-viewed-${productIds.sort().join("-")}-${locationGroupId || "none"}`;

/* ---------- GET PRODUCTS LIST ---------- */
export const getProducts = unstable_cache(
  async (
    query: ProductQuery = {}
  ): Promise<{ products: any[]; totalCount: number }> => {
    console.log(`[CACHE MISS] Fetching products:`, query);
    return await productsList(query, STORE_ID);
  }
);

export const getHotDeals = unstable_cache(
  async (query: HotDealsQuery): Promise<any[]> => {
    console.log(`[CACHE MISS] Fetching hot deals:`, query);
    return await hotDeals(query, STORE_ID);
  }
);
