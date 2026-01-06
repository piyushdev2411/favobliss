import { db } from "@/lib/db";
import { Brand } from "@/types"; // Your Brand type

// Get all brands (for lists)
export async function allBrands(storeId: string): Promise<Brand[]> {
  try {
    const brands = await db.brand.findMany({
      where: { storeId },
      orderBy: { name: "asc" },
    });
    return brands;
  } catch (error) {
    console.error("[GET_ALL_BRANDS_ERROR]", error);
    return [];
  }
}

// Get brand by slug
export async function brandBySlug(
  storeId: string,
  slug: string
): Promise<Brand | null> {
  try {
    const brand = await db.brand.findFirst({
      where: {
        storeId,
        slug: { equals: slug, mode: "insensitive" },
      },
    });
    return brand;
  } catch (error) {
    console.error("[GET_BRAND_BY_SLUG_ERROR]", error);
    return null;
  }
}

