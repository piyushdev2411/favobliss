"use server";

import { cache } from "react";
import { Review } from "@/types";
import { productReviews } from "@/data/functions/review";
import { unstable_cache } from "next/cache";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387"; // Not used here, but for consistency

// Cache key generator (dynamic per productId/page/limit)
const reviewsKey = (productId: string, page: number, limit: number) => 
  `reviews-${productId}-page${page}-limit${limit}`;

export const getReviews = unstable_cache(
  async (productId: string, page: number = 1, limit: number = 10): Promise<Review[]> => {
    console.log(`[CACHE MISS] Fetching reviews for product: ${productId}, page: ${page}, limit: ${limit}`);
    return await productReviews({ productId, page, limit });
  }
);