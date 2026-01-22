"use server";

import { getHotProductsBanner, getHotProductsSection } from "@/data/functions/hot-products";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

// Cache keys (unique per store)
const HOT_PRODUCTS_SECTION_KEY = `hot-products-section-${STORE_ID}`;
const HOT_PRODUCTS_BANNER_KEY = `hot-products-banner-${STORE_ID}`;

/**
 * Get the full Hot Products section (banner + products with variants/images/prices)
 * Returns null if not created yet
 */
export const HotProductsSection = unstable_cache(async () => {
  console.log(`[CACHE MISS] Fetching hot products section for store: ${STORE_ID}`);
  return await getHotProductsSection(STORE_ID);
});

/**
 * Lightweight version – only banner image (perfect for layout/header preload)
 */
export const HotProductsBanner = unstable_cache(async () => {
  console.log(`[CACHE MISS] Fetching hot products banner for store: ${STORE_ID}`);
  return await getHotProductsBanner(STORE_ID);
});