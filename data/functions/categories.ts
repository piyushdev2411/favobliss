// lib/categories.ts
import { db } from "@/lib/db";
import { Category } from "@prisma/client";

export interface TransformedCategory extends Category {
  subCategories: Array<
    Category & {
      childSubCategories: Array<
        Category & {
          childSubCategories: Category[];
        }
      >;
    }
  >;
}

/* ---------- GET ALL CATEGORIES (with nested structure) ---------- */
export async function allCategories(storeId: string): Promise<TransformedCategory[]> {
  const categories = await db.category.findMany({
    where: { storeId },
    include: {
      subCategories: {
        include: {
          childSubCategories: {
            include: {
              childSubCategories: {
                include: {
                  childSubCategories: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Transform to filter only root subCategories (parentId === null)
  //@ts-ignore
  return categories.map((category) => ({
    ...category,
    subCategories: category.subCategories
      .filter((sub) => sub.parentId === null)
      .map((sub) => ({
        ...sub,
        childSubCategories: sub.childSubCategories.map((child) => ({
          ...child,
          childSubCategories: child.childSubCategories.map((grandchild) => ({
            ...grandchild,
            childSubCategories: grandchild.childSubCategories || [],
          })),
        })),
      })),
  }));
}

/* ---------- GET CATEGORY BY SLUG ---------- */
export async function categoryBySlug(
  storeId: string,
  slug: string
): Promise<any | null> {
  return await db.category.findUnique({
    where: { slug, storeId },
    include: {
      subCategories: {
        include: {
          childSubCategories: {
            include: {
              childSubCategories: {
                include: {
                  childSubCategories: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

/* ---------- GET CATEGORY BY ID ---------- */
export async function categoryById(id: string): Promise<Category | null> {
  return await db.category.findUnique({
    where: { id },
  });
}