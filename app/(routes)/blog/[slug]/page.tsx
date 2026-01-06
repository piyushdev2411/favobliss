import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBlogBySlug } from "@/actions/get-blog";
import { BlogDetail } from "@/components/BlogsEditor/BlogDetail";

export const revalidate = 600;

interface Blog {
  id: string;
  title: string;
  banner: string;
  slug: string;
  views: number | null;
  postedBy: string | null;
  content: any;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  openGraphImage?: string;
}


export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const blog = await getBlogBySlug(params.slug);
    return {
      title: blog?.metaTitle || blog?.title,
      description:
        blog?.metaDescription || `${blog?.title} - Read the full article here.`,
      keywords: blog?.metaKeywords,
      openGraph: {
        title: blog?.metaTitle || blog?.title,
        description:
          blog?.metaDescription || `${blog?.title} - Read the full article here.`,
        images: blog?.openGraphImage
          ? [blog?.openGraphImage]
          : blog?.banner
          ? [blog?.banner]
          : [],
        type: "article",
      },
    };
  } catch (error) {
    notFound();
  }
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  let blog: any | null = null;

  try {
    blog = await getBlogBySlug(params.slug);

    // const newViews = (blog.views || 0) + 1;
    // try {
    //   await fetch(`${URL}/api/blogs/${blog.id}`, {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ views: newViews }),
    //   });
    //   blog.views = newViews;
    // } catch (error) {
    //   console.error("Failed to update views:", error);
    // }
  } catch (error) {
    console.error(error);
    notFound();
  }

  if (!blog) {
    notFound();
  }

  return <BlogDetail blog={blog} />;
}
