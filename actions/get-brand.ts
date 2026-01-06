import { cache } from "react";
import { allBrands, brandBySlug } from "@/data/functions/brand";
import { Brand } from "@/types";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

export const getBrandBySlug = cache(
  async (slug: string): Promise<Brand | null> => {
    console.log(`[CACHE MISS] Fetching brand by slug: ${slug}`);
    return await brandBySlug(STORE_ID, slug);
  }
);
