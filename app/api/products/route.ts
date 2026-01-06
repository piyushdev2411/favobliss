// app/api/products/route.ts (updated)
import { getProducts } from "@/actions/get-products";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = {
    categoryId: searchParams.get("categoryId") || undefined,
    subCategoryId: searchParams.get("subCategoryId") || undefined,
    brandId: searchParams.get("brandId") || undefined,
    colorId: searchParams.get("colorId") || null,
    sizeId: searchParams.get("sizeId") || null,
    price: searchParams.get("price") || undefined,
    rating: searchParams.get("rating") || undefined,
    discount: searchParams.get("discount") || undefined,
    type: searchParams.get("type") as "MEN" | "WOMEN" | undefined,
    isFeatured: searchParams.get("isFeatured") === "true" ? true : undefined,
    isNewArrival: searchParams.get("isNewArrival") === "true" ? true : undefined,
    page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
    limit: "12",
  };

  try {
    const { products, totalCount } = await getProducts(query as any);
    return NextResponse.json({ products, totalCount });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export const revalidate = 60;