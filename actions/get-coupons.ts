"use server";

import { cache } from "react";
import { Color, Coupons } from "@/types";
import { allColors } from "@/data/functions/colors";
import { allCoupons } from "@/data/functions/coupons";
import { unstable_cache } from "next/cache";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

// Cache keys
const COLORS_KEY = `colors-${STORE_ID}`;
const COUPONS_KEY = `coupons-${STORE_ID}`;

/* ---------- GET COUPONS ---------- */
export const getCoupons = unstable_cache(async (): Promise<any[]> => {
  console.log(`[CACHE MISS] Fetching coupons for store: ${STORE_ID}`);
  return await allCoupons(STORE_ID);
});
