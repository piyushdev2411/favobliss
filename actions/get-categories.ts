import { cache } from "react";
import {
  allCategories,
  categoryBySlug,
  categoryById,
} from "@/data/functions/categories";
import { Category } from "@/types";
import { unstable_cache } from "next/cache";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

// Cache keys
const CATEGORIES_ALL_KEY = `categories-all-${STORE_ID}`;
const categorySlugKey = (slug: string) => `category-slug-${slug}-${STORE_ID}`;
const categoryIdKey = (id: string) => `category-id-${id}`;

export const getCategories = unstable_cache(async (): Promise<any[]> => {
  console.log(`[CACHE MISS] Fetching all categories for store: ${STORE_ID}`);
  return await allCategories(STORE_ID);
});
