// lib/homepage-categories.ts
import { db } from "@/lib/db";

const includeRelations = {
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
};

export async function allHomepageCategories(storeId: string): Promise<any[]> {
  return await db.homepageCategory.findMany({
    where: { storeId },
    ...includeRelations,
  });
}

export async function homepageCategoryByIdOrFirst(
  idOrFirst: string
): Promise<any | null> {
  if (idOrFirst === "first") {
    return await db.homepageCategory.findFirst(includeRelations);
  }

  return await db.homepageCategory.findUnique({
    where: { id: idOrFirst },
    ...includeRelations,
  });
}

export async function homepageCategoryByIdWithStore(
  storeId: string,
  id: string
): Promise<any | null> {
  return await db.homepageCategory.findUnique({
    where: { id, storeId },
    ...includeRelations,
  });
}