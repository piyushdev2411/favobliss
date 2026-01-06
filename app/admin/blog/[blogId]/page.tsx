
import { BlogForm } from "@/components/admin/store/forms/blog-form";
import { db } from "@/lib/db";

interface BlogPageProps {
  params: { blogId: string };
}

const BlogPage = async ({ params }: BlogPageProps) => {
  let blog = null;

  if (params.blogId !== "create") {
    blog = await db.blog.findUnique({
      where: {
        id: params.blogId,
      },
    });
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BlogForm initialData={blog} />
      </div>
    </div>
  );
};

export default BlogPage;
