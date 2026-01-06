import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

interface SearchQuery {
  storeId: string;
  query?: string;
  brandName?: string;
  page?: number;
  limit?: number;
}

export async function searchStore(queryParams: SearchQuery): Promise<any> {
  const { storeId, query, brandName, page = 1, limit = 12 } = queryParams;
  const skip = (page - 1) * limit;
  const brandLimit = Math.floor(limit);
  const categoryLimit = Math.floor(limit);
  const subCategoryLimit = Math.floor(limit);
  const productLimit = query ? Math.ceil(limit) : 12;

  let searchResults;

  if (!query) {
    // Suggested mode (no query)
    const brands = await db.brand.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      take: brandLimit,
    });

    const categories = await db.category.findMany({
      where: { storeId },
      include: {
        subCategories: {
          include: {
            childSubCategories: {
              include: { childSubCategories: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: categoryLimit,
    });

    const transformedCategories = categories.map((category) => ({
      ...category,
      subCategories: category.subCategories
        .filter((sub) => sub.parentId === null)
        .map((sub) => ({
          ...sub,
          childSubCategories: sub.childSubCategories.map((child) => ({
            ...child,
            childSubCategories: child.childSubCategories || [],
          })),
        })),
    }));

    const subCategories = await db.subCategory.findMany({
      where: { storeId },
      include: {
        category: true,
        parent: true,
        childSubCategories: {
          include: { childSubCategories: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: subCategoryLimit,
    });

    const products = await db.product.findMany({
      where: {
        storeId,
        isArchieved: false,
      },
      include: {
        brand: true,
        category: true,
        subCategory: { include: { parent: true } },
        variants: {
          include: {
            size: true,
            color: true,
            images: true,
            variantSpecifications: {
              include: { specificationField: { include: { group: true } } },
            },
            variantPrices: {
              include: { locationGroup: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: productLimit,
    });

    searchResults = {
      brands,
      categories: transformedCategories,
      subCategories,
      products,
      pagination: {
        page,
        limit,
        totalBrands: brands.length,
        totalCategories: categories.length,
        totalSubCategories: subCategories.length,
        totalProducts: products.length,
      },
      isSuggested: true,
    };
  } else {
    // Search mode with query
    const brands = await db.brand.findMany({
      where: {
        storeId,
        name: { contains: query, mode: "insensitive" },
      },
      take: brandLimit,
    });

    const categories = await db.category.findMany({
      where: {
        storeId,
        name: { contains: query, mode: "insensitive" },
      },
      include: {
        subCategories: {
          include: {
            childSubCategories: {
              include: { childSubCategories: true },
            },
          },
        },
      },
      take: categoryLimit,
    });

    const transformedCategories = categories.map((category) => ({
      ...category,
      subCategories: category.subCategories
        .filter((sub) => sub.parentId === null)
        .map((sub) => ({
          ...sub,
          childSubCategories: sub.childSubCategories.map((child) => ({
            ...child,
            childSubCategories: child.childSubCategories || [],
          })),
        })),
    }));

    const subCategories = await db.subCategory.findMany({
      where: {
        storeId,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          {
            childSubCategories: {
              some: {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  {
                    childSubCategories: {
                      some: {
                        OR: [
                          { name: { contains: query, mode: "insensitive" } },
                          {
                            childSubCategories: {
                              some: {
                                name: {
                                  contains: query,
                                  mode: "insensitive",
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      include: {
        category: true,
        parent: true,
        childSubCategories: {
          include: { childSubCategories: true },
        },
      },
      take: subCategoryLimit,
    });

    const words = query.split(/\s+/).filter((word) => word.length > 0);

    let variantsWhere: Prisma.VariantWhereInput = {
      product: {
        storeId,
        isArchieved: false,
      },
      AND: words.map((word) => ({
        OR: [
          { name: { contains: word, mode: "insensitive" } },
          // Add if needed: { description: { contains: word, mode: "insensitive" } },
          // { about: { contains: word, mode: "insensitive" } },
        ],
      })),
    };

    if (brandName) {
      const brand = await db.brand.findFirst({
        where: {
          name: brandName,
          storeId,
        },
      });
      if (!brand) {
        throw new Error("Brand not found");
      }
      variantsWhere.product = {
        ...variantsWhere.product,
        //@ts-ignore
        brandId: brand.id,
      };
    }

    const matchingVariants = await db.variant.findMany({
      where: variantsWhere,
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            subCategory: { include: { parent: true } },
          },
        },
        size: true,
        color: true,
        images: true,
        variantSpecifications: {
          include: { specificationField: { include: { group: true } } },
        },
        variantPrices: {
          include: { locationGroup: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: productLimit,
    });

    const productsMap = new Map<string, any>();
    matchingVariants.forEach((variant) => {
      if (!productsMap.has(variant.productId)) {
        productsMap.set(variant.productId, {
          ...variant.product,
          variants: [],
        });
      }
      productsMap.get(variant.productId)!.variants.push(variant);
    });

    const products = Array.from(productsMap.values());

    searchResults = {
      brands,
      categories: transformedCategories,
      subCategories,
      products,
      pagination: {
        page,
        limit,
        totalBrands: brands.length,
        totalCategories: categories.length,
        totalSubCategories: subCategories.length,
        totalProducts: products.length,
      },
      isSuggested: false,
    };
  }

  return searchResults;
}