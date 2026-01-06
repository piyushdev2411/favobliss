import { unstable_cache } from "next/cache";
import { blogList, blogBySlug } from "@/data/functions/blogs";
import type { PaginatedBlogs } from "@/types";
import { Blog } from "@prisma/client";

export const getBlogBySlug = unstable_cache(
  async (slug: string): Promise<Blog | null> => {
    return await blogBySlug(slug);
  },
  //@ts-ignore
  (slug: string) => [`blog-slug-${slug}`],
  {
    revalidate: 600,
    tags: ["blog-detail"],
  }
);
