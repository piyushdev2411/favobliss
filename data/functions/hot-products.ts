// lib/hot-products.ts
import { db } from "@/lib/db";

/**
 * Shared include for HotProductsSection queries
 * Loads products with full variant + pricing + images + relations
 */
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
      orderBy: { position: "asc" } as const,
    },
  },
} as const;

/**
 * Get the SINGLE hot products section for a store
 * (Always returns one or null)
 */

export async function getHotProductsSection(storeId: string) {
  const section = await db.hotProductsSection.findFirst({
    where: { storeId },
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
        orderBy: { position: "asc" },
      },
    },
  });

  if (!section) return null;

  // Flatten: extract product from the join table
  const products = section.products.map((item) => ({
    ...item.product,
    // Optional: add average rating if you have it
    // averageRating: item.product.reviews?.length ? ... : 0,
  }));

  return {
    bannerImage: section.bannerImage,
    products,
  };
}

/**
 * Get the hot products section (used in Server Components / homepage)
 * Returns null if not created yet
 */
export async function getHotProductsForStore(storeId: string) {
  return await db.hotProductsSection.findFirst({
    where: { storeId },
    ...includeRelations,
  });
}

/**
 * Lightweight version – only banner (for header/preload)
 */
export async function getHotProductsBanner(storeId: string) {
  return await db.hotProductsSection.findFirst({
    where: { storeId },
    select: {
      id: true,
      bannerImage: true,
      updatedAt: true,
    },
  });
}

/**
 * Secure admin version – validates store ownership
 */
export async function getHotProductsSectionSecure(storeId: string) {
  return await db.hotProductsSection.findFirst({
    where: { storeId },
    ...includeRelations,
  });
}