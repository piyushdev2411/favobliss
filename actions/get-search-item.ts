"use server";

import { searchStore } from "@/data/functions/search";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

interface SearchParams {
  query?: string;
  brandName?: string;
  page?: number;
  limit?: number;
}

// Only cache "suggested" results (no query)
const getCachedSuggested = unstable_cache(
  async (page: number, limit: number): Promise<any> => {
    console.log(
      `[CACHE MISS] Fetching suggested search results: page=${page}, limit=${limit}`
    );
    return await searchStore({ storeId: STORE_ID, query: "", page, limit });
  }
);

export async function getSearchItem(params: SearchParams = {}): Promise<any> {
  const { query, page = 1, limit = 12 } = params;

  // Case 1: No query → use cache (suggested/trending)
  if (!query || query.trim() === "") {
    return await getCachedSuggested(page, limit);
  }

  // Case 2: Real search query → NO cache, always fresh
  console.log(`[NO CACHE] Running live search for: "${query}"`);
  return await searchStore({
    storeId: STORE_ID,
    query: query.trim(),
    brandName: params.brandName,
    page,
    limit,
  });
}
