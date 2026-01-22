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


/* ---------- GET CATEGORY BY SLUG ---------- */
export const getCategoryBySlug = unstable_cache(
  async (slug: string): Promise<any | null> => {
    console.log(`[CACHE MISS] Fetching category by slug: ${slug}`);
    return await categoryBySlug(STORE_ID, slug);
  }
);

/* ---------- GET CATEGORY BY ID ---------- */
export const getCategoryById = unstable_cache(
  async (id: string): Promise<any | null> => {
    console.log(`[CACHE MISS] Fetching category by id: ${id}`);
    return await categoryById(id);
  }
);