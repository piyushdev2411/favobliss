import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const allowedOrigins = [
  process.env.NEXT_PUBLIC_FRONTEND_URL,
  "http://localhost:3000",
  "https://favobliss.vercel.app",
].filter(Boolean);

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; homepageCategoryId: string } }
) {
  try {
    const session = await auth();
    const { name, description } = await request.json();

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized Access", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.homepageCategoryId) {
      return new NextResponse("Homepage Category Id is required", {
        status: 400,
      });
    }

    const storeById = await db.store.findUnique({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
    });

    if (!storeById) {
      return new NextResponse("Store does not exist or unauthorized", {
        status: 404,
      });
    }

    const homepageCategory = await db.homepageCategory.updateMany({
      where: {
        id: params.homepageCategoryId,
        storeId: params.storeId,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(homepageCategory);
  } catch (error) {
    console.log("[HOMEPAGECATEGORY_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { storeId: string; homepageCategoryId: string } }
) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized Access", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.homepageCategoryId) {
      return new NextResponse("Homepage Category Id is required", {
        status: 400,
      });
    }

    const storeById = await db.store.findUnique({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
    });

    if (!storeById) {
      return new NextResponse("Store does not exist or unauthorized", {
        status: 404,
      });
    }

    const homepageCategory = await db.homepageCategory.deleteMany({
      where: {
        id: params.homepageCategoryId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(homepageCategory);
  } catch (error) {
    console.log("[HOMEPAGECATEGORY_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { homepageCategoryId: string } }
) {
  const origin = request.headers.get("origin");

  const corsOrigin = allowedOrigins.includes(origin ?? "")
    ? origin ?? ""
    : allowedOrigins[0];

  const headers = {
    "Access-Control-Allow-Origin": corsOrigin || "",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };

  try {
    if (!params.homepageCategoryId) {
      return new NextResponse("Homepage Category Id is required", {
        status: 400,
        headers,
      });
    }

    const homepageCategory = await db.homepageCategory.findUnique({
      where: {
        id: params.homepageCategoryId,
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
      return new NextResponse("Homepage category not found", {
        status: 404,
        headers,
      });
    }

    return NextResponse.json(homepageCategory, { headers });
  } catch (error) {
    console.log("[HOMEPAGECATEGORY_GET]", error);
    return new NextResponse("Internal server error", { status: 500, headers });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { storeId: string; homepageCategoryId: string } }
) {
  try {
    const session = await auth();
    const { productIds } = await request.json();

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized Access", { status: 401 });
    }

    if (!Array.isArray(productIds)) {
      return new NextResponse("Product IDs must be an array", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.homepageCategoryId) {
      return new NextResponse("Homepage Category Id is required", { status: 400 });
    }

    const storeById = await db.store.findUnique({
      where: {
        id: params.storeId,
      },
    });

    if (!storeById) {
      return new NextResponse("Store does not exist or unauthorized", { status: 404 });
    }

    const homepageCategory = await db.homepageCategory.findUnique({
      where: {
        id: params.homepageCategoryId,
        storeId: params.storeId,
      },
    });

    if (!homepageCategory) {
      return new NextResponse("Homepage category not found", { status: 404 });
    }

    const validProducts = await db.product.findMany({
      where: {
        id: { in: productIds },
        storeId: params.storeId,
      },
    });

    if (validProducts.length !== productIds.length) {
      return new NextResponse("One or more products are invalid or do not belong to the store", { status: 400 });
    }

    const existingAssociations = await db.homepageCategoryProduct.findMany({
      where: {
        homepageCategoryId: params.homepageCategoryId,
      },
      select: {
        productId: true,
      },
    });

    const existingProductIds = new Set(existingAssociations.map((assoc) => assoc.productId));
    const newProductIds = new Set(productIds);

    const productsToAdd = productIds.filter((id) => !existingProductIds.has(id));

    const productsToRemove = existingAssociations
      .map((assoc) => assoc.productId)
      .filter((id) => !newProductIds.has(id));
    await db.$transaction([
      db.homepageCategoryProduct.deleteMany({
        where: {
          homepageCategoryId: params.homepageCategoryId,
          productId: { in: productsToRemove },
        },
      }),
      ...(productsToAdd.length > 0
        ? [
            db.homepageCategoryProduct.createMany({
              data: productsToAdd.map((productId) => ({
                homepageCategoryId: params.homepageCategoryId,
                productId,
              })),
            }),
          ]
        : []),
    ]);

    return NextResponse.json({ message: "Products updated successfully" });
  } catch (error) {
    console.log("[HOMEPAGECATEGORY_PRODUCTS_POST] Error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
