import { Metadata } from "next";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { BlogColumn } from "@/components/admin/store/utils/columns";
import { BlogClient } from "@/components/admin/store/utils/blog-client";

export const metadata: Metadata = {
  title: "Admin | Blog Posts",
};

interface BlogPageProps {
  params: { storeId?: string };
}

const BlogPage = async ({ params }: BlogPageProps) => {
  const blogs = await db.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBlogs: BlogColumn[] = blogs.map((item) => ({
    id: item.id,
    title: item.title,
    author: item.postedBy || "Admin Favobliss",
    published: item.published,
    // views: item.views || 0,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BlogClient data={formattedBlogs} />
      </div>
    </div>
  );
};

export default BlogPage;
