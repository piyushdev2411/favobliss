import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title = "Untitled Document",
      content = "",
      banner,
      slug,
      postedBy,
      published,
      views = 0,
      metaTitle,
      metaDescription,
      metaKeywords,
      openGraphImage,
    } = body;
    
    const blog = await db.blog.create({
      data: {
        title,
        content,
        banner,
        slug,
        postedBy,
        published,
        views,
        metaTitle,
        metaDescription,
        metaKeywords,
        openGraphImage,
      },
    });
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const blog = await db.blog.findUnique({
        where: { slug },
      });

      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }

      return NextResponse.json(blog, { status: 200 });
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      db.blog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.blog.count(),
    ]);

    return NextResponse.json(
      {
        blogs,
        total,
        page,
        limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
