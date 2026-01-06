import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const data: Record<string, any> = {};

    if (body.title !== undefined) data.title = body.title;
    if (body.content !== undefined) data.content = body.content;
    if (body.banner !== undefined) data.banner = body.banner;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.postedBy !== undefined) data.postedBy = body.postedBy;
    if (body.published !== undefined) data.published = body.published;
    if (body.views !== undefined) data.views = body.views;
    if (body.metaTitle !== undefined) data.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined)
      data.metaDescription = body.metaDescription;
    if (body.metaKeywords !== undefined) data.metaKeywords = body.metaKeywords;
    if (body.openGraphImage !== undefined)
      data.openGraphImage = body.openGraphImage;

    data.updatedAt = new Date();

    const blog = await db.blog.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.blog.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Blog deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await db.blog.findUnique({
      where: { id: params.id },
    });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
