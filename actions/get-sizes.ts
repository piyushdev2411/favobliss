import { cache } from "react";
import { Color, Coupons, Size, InvoiceData } from "@/types";
import { allSizes } from "@/data/functions/size";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

// Cache keys
const COLORS_KEY = `colors-${STORE_ID}`;
const COUPONS_KEY = `coupons-${STORE_ID}`;
const SIZES_KEY = `sizes-${STORE_ID}`;

export const getSizes = cache(async (): Promise<Size[]> => {
  console.log(`[CACHE MISS] Fetching sizes`);
  return await allSizes(STORE_ID);
});
