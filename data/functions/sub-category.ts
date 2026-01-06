"use server";

import { db } from "@/lib/db";
import { SubCategory } from "@/types";

/* -------------------------------------------------
   1. All sub-categories (root only)
   ------------------------------------------------- */
export async function allRootSubCategories(storeId: string): Promise<any[]> {
  const subCategories = await db.subCategory.findMany({
    where: { storeId },
    include: {
      category: true,
      parent: true,
      childSubCategories: {
        include: {
          childSubCategories: {
            include: { childSubCategories: true },
          },
        },
      },
    },
  });

  // Return only top-level (parentId === null)
  return subCategories
    .filter((sub) => sub.parentId === null)
    .map((sub) => ({
      ...sub,
      childSubCategories: sub.childSubCategories.map((child) => ({
        ...child,
        childSubCategories: child.childSubCategories.map((grand) => ({
          ...grand,
          childSubCategories: grand.childSubCategories || [],
        })),
      })),
    }));
}

/* -------------------------------------------------
   2. Sub-category by ID
   ------------------------------------------------- */
export async function subCategoryById(id: string): Promise<any | null> {
  return await db.subCategory.findUnique({
    where: { id },
    include: {
      category: true,
      parent: true,
      childSubCategories: true,
    },
  });
}

/* -------------------------------------------------
   3. Sub-category by slug
   ------------------------------------------------- */
export async function subCategoryBySlug(
  storeId: string,
  slug: string
): Promise<any | null> {
  return await db.subCategory.findUnique({
    where: { slug, storeId },
    include: {
      category: true,
      parent: true,
      childSubCategories: {
        include: {
          childSubCategories: {
            include: { childSubCategories: true },
          },
        },
      },
    },
  });
}

/* -------------------------------------------------
   4. Sub-categories of a specific category
   ------------------------------------------------- */
export async function subCategoriesByCategoryId(
  storeId: string,
  categoryId: string
): Promise<any[]> {
  const subCategories = await db.subCategory.findMany({
    where: {
      storeId,
      categoryId,
    },
    include: {
      category: true,
      parent: true,
      childSubCategories: {
        include: {
          childSubCategories: {
            include: { childSubCategories: true },
          },
        },
      },
    },
  });

  return subCategories
    .filter((sub) => sub.parentId === null)
    .map((sub) => ({
      ...sub,
      childSubCategories: sub.childSubCategories.map((child) => ({
        ...child,
        childSubCategories: child.childSubCategories.map((grand) => ({
          ...grand,
          childSubCategories: grand.childSubCategories || [],
        })),
      })),
    }));
}