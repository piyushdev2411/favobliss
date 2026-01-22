"use server";

import { cache } from "react";
import { SubCategory } from "@/types";
import {
  allRootSubCategories,
  subCategoryById,
  subCategoryBySlug,
  subCategoriesByCategoryId,
} from "@/data/functions/sub-category";
import { unstable_cache } from "next/cache";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

/* ------------------- Cache Keys ------------------- */
const rootSubCatsKey = `subcats-root-${STORE_ID}`;
const subCatByIdKey = (id: string) => `subcat-id-${id}`;
const subCatBySlugKey = (slug: string) => `subcat-slug-${slug}`;
const subCatsByCatKey = (catId: string) => `subcats-cat-${catId}-${STORE_ID}`;

/* ------------------- Actions ------------------- */

/** 1. All root sub-categories (cached) */
export const getSubCategories = unstable_cache(async (): Promise<SubCategory[]> => {
  console.log(`[CACHE MISS] Fetching root sub-categories`);
  return await allRootSubCategories(STORE_ID);
});

/** 2. Sub-category by ID (cached) */
export const getSubCategoryById = unstable_cache(
  async (id: string): Promise<SubCategory> => {
    console.log(`[CACHE MISS] Fetching sub-category by id: ${id}`);
    const sub = await subCategoryById(id);
    if (!sub) throw new Error("SubCategory not found");
    return sub;
  }
);

/** 3. Sub-category by slug (cached) */
export const getSubCategoryBySlug = unstable_cache(
  async (slug: string): Promise<SubCategory> => {
    const cleanSlug = slug.split("?")[0];
    console.log(`[CACHE MISS] Fetching sub-category by slug: ${cleanSlug}`);
    const sub = await subCategoryBySlug(STORE_ID, cleanSlug);
    if (!sub) throw new Error("SubCategory not found");
    return sub;
  }
);

/** 4. Sub-categories under a category (cached) */
export const getSubCategoriesByCategoryId = cache(
  async (categoryId: string): Promise<SubCategory[]> => {
    console.log(
      `[CACHE MISS] Fetching sub-categories for category: ${categoryId}`
    );
    return await subCategoriesByCategoryId(STORE_ID, categoryId);
  }
);
