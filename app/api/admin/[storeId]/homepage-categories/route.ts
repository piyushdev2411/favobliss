import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { name, description } = await request.json();
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized Access", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const storeById = await db.store.findUnique({
      where: {
        id: params.storeId,
      },
    });

    if (!storeById) {
      return new NextResponse("Store does not exist or unauthorized", {
        status: 404,
      });
    }

    const homepageCategory = await db.homepageCategory.create({
      data: {
        name,
        description,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(homepageCategory);
  } catch (error) {
    console.log("[HOMEPAGECATEGORY_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const homepageCategoryId = searchParams.get("homepageCategoryId");

    if (homepageCategoryId) {
      const homepageCategory = await db.homepageCategory.findUnique({
        where: {
          id: homepageCategoryId,
          storeId: params.storeId,
        },
        include: {
          products: {
            include: {
              product: {
                include: {
                  variants: {
                    include: {
                      images: true,
                      variantPrices: true,
                    },
                  },
                  category: true,
                  subCategory: true,
                  brand: true,
                },
              },
            },
          },
        },
      });

      if (!homepageCategory) {
        return new NextResponse("Homepage category not found", { status: 404 });
      }

      return NextResponse.json(homepageCategory);
    }

    const homepageCategories = await db.homepageCategory.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        products: {
          include: {
            product: {
              include: {
                variants: {
                  include: {
                    images: true,
                    variantPrices: true,
                  },
                },
                category: true,
                subCategory: true,
                brand: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(homepageCategories);
  } catch (error) {
    console.log("[HOMEPAGECATEGORY_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
