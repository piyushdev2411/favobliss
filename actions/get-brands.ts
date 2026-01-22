// actions/get-brands.ts
"use server";

import { cache } from "react";
import { allBrands, brandBySlug } from "@/data/functions/brand";
import { Brand } from "@/types";
import { unstable_cache } from "next/cache";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

// Cache key helpers
const BRANDS_ALL_KEY = "brands-all";
const brandSlugKey = (slug: string) => `brand-slug-${slug}`;

/* ---------- GET ALL BRANDS ---------- */
export const getBrands = unstable_cache(async (): Promise<Brand[]> => {
  console.log(`[CACHE MISS] Fetching all brands for store: ${STORE_ID}`);
  return await allBrands(STORE_ID);
});