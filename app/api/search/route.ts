// app/api/search/route.ts
import { getSearchItem } from "@/actions/get-search-item";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);

  const keyword = {
    query: searchParams.get("query") || "",
    colorId: searchParams.get("colorId") || undefined,
    sizeId: searchParams.get("sizeId") || undefined,
    price: searchParams.get("price") || undefined,
    brandId: searchParams.get("brandId") || undefined,
    rating: searchParams.get("rating") || undefined,
    discount: searchParams.get("discount") || undefined,
    page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
    limit: "12",
  };

  if (!keyword.query) {
    return NextResponse.json({ products: [], pagination: { totalProducts: 0 } });
  }

  try {
    const results = await getSearchItem(keyword as any);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
  }
};

export const revalidate = 60;