import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const SINGLETON_ID = "hot-products-singleton";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) return new NextResponse("Store ID required", { status: 400 });

    const section = await db.hotProductsSection.findUnique({
      where: { storeId: params.storeId },
      include: {
        products: {
          include: { product: { include: { variants: { include: { images: true } } } } },
          orderBy: { position: "asc" },
        },
      },
    });

    return NextResponse.json(section ?? { bannerImage: "", products: [] });
  } catch (error) {
    console.log("[HOT_PRODUCTS_SINGLETON_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await auth();
    const { bannerImage, productIds } = await req.json();

    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.storeId) return new NextResponse("Store ID required", { status: 400 });

    const store = await db.store.findUnique({ where: { id: params.storeId } });
    if (!store) return new NextResponse("Store not found", { status: 404 });

    // Validate products belong to store
    if (productIds && productIds.length > 0) {
      const validProducts = await db.product.count({
        where: { id: { in: productIds }, storeId: params.storeId },
      });
      if (validProducts !== productIds.length) {
        return new NextResponse("Invalid products", { status: 400 });
      }
    }

    const section = await db.hotProductsSection.upsert({
      where: { storeId: params.storeId },
      update: {
        bannerImage,
        products: {
          deleteMany: {},
          create: (productIds || []).map((productId: string, index: number) => ({
            productId,
            position: index,
          })),
        },
      },
      create: {
        storeId: params.storeId,
        bannerImage,
        products: {
          create: (productIds || []).map((productId: string, index: number) => ({
            productId,
            position: index,
          })),
        },
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.log("[HOT_PRODUCTS_SINGLETON_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}