import { cache } from "react";
import { blogList, blogBySlug } from "@/data/functions/blogs";
import { Blog } from "@prisma/client";

// Dynamic cache key: page + limit
const getBlogsCacheKey = (page: number, limit: number) =>
  `blogs-page-${page}-limit-${limit}`;

// Cached list
export const getBlogs = cache(async (page = 1, limit = 9): Promise<any> => {
  console.log(`[CACHE MISS] Fetching blogs: page=${page}, limit=${limit}`);
  return await blogList(page, limit);
});

// Cached by slug
const getBlogBySlugCacheKey = (slug: string) => `blog-slug-${slug}`;

export const getBlogBySlug = cache(async (slug: string): Promise<Blog | null> => {
  console.log(`[CACHE MISS] Fetching blog: ${slug}`);
  return await blogBySlug(slug);
});