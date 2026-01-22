// actions/get-products.ts
"use server";

import { cache } from "react";
import {
  allHomepageCategories,
  homepageCategoryByIdOrFirst,
} from "@/data/functions/homepage-categories";
import { HomepageCategory } from "@/types";
import { unstable_cache } from "next/cache";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

// Cache keys
const HOMEPAGE_CATEGORIES_KEY = `homepage-categories-${STORE_ID}`;
const homepageCategoryIdKey = (id: string) => `homepage-category-${id}`;

export const getHomepageCategory = unstable_cache(
  async (): Promise<HomepageCategory[]> => {
    console.log(
      `[CACHE MISS] Fetching homepage categories for store: ${STORE_ID}`
    );
    return await allHomepageCategories(STORE_ID);
  }
);

export const getHomepageCategoryById = unstable_cache(
  async (idOrFirst: string): Promise<HomepageCategory | null> => {
    console.log(`[CACHE MISS] Fetching homepage category: ${idOrFirst}`);
    return await homepageCategoryByIdOrFirst(idOrFirst);
  }
);
