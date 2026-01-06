import { db } from "@/lib/db";
import { Blog } from "@prisma/client";

export interface PaginatedBlogs {
  blogs: Blog[];
  total: number;
  page: number;
  limit: number;
}

export async function blogList(
  page = 1,
  limit = 9
): Promise<PaginatedBlogs> {
  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    db.blog.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.blog.count(),
  ]);

  return { blogs, total, page, limit };
}

export async function blogBySlug(slug: string): Promise<Blog | null> {
  return await db.blog.findUnique({
    where: { slug },
  });
}