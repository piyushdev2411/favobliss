//@ts-nocheck
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Product } from "@/types"; 

interface ProductQuery {
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  limit?: number | string; // Allow string for caller flexibility
  page?: number | string;
  type?: "MEN" | "WOMEN" | "KIDS" | "BEAUTY" | "ELECTRONICS";
  price?: string; // e.g., "1000-2000"
  variantIds?: string[];
  pincode?: number | string;
  rating?: string; // min rating
  discount?: string; // min discount %
  selectFields?: string[]; // Added for generateStaticParams optimization
  locationGroupId?: string;
}

interface HotDealsQuery extends ProductQuery {
  timeFrame?: "7 days" | "30 days" | "90 days" | "all time";
}

// Static base include for Product (no functions)
const productBaseInclude: Prisma.ProductInclude = {
  brand: true,
  category: true,
  subCategory: {
    include: {
      parent: true,
    },
  },
  variants: {
    orderBy: { createdAt: Prisma.SortOrder.asc },
    include: {
      size: true,
      color: true,
      images: {
        orderBy: { createdAt: Prisma.SortOrder.asc }, // Added: Sort images consistently
      },
      variantPrices: {
        include: {
          locationGroup: {
            include: { locations: true },
          },
        },
      },
      variantSpecifications: {
        include: {
          specificationField: {
            include: { group: true },
          },
        },
      },
    },
  },
  reviews: { select: { rating: true } },
  coupons: {
    where: {
      coupon: {
        isActive: true,
        startDate: { lte: new Date() },
        expiryDate: { gte: new Date() },
      },
    },
    include: {
      coupon: {
        select: {
          id: true,
          code: true,
          value: true,
          description: true,
          usagePerUser: true,
          usedCount: true,
        },
      },
    },
    orderBy: { createdAt: Prisma.SortOrder.desc },
  },
};

const productListInclude: Prisma.ProductInclude = {
  variants: {
    orderBy: { createdAt: "asc" },
    take: 1, // Only first variant needed for card
    select: {
      name: true,
      slug: true,
      stock: true,
      images: {
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { url: true },
      },
      variantPrices: {
        select: {
          price: true,
          mrp: true,
          locationGroupId: true,
        },
      },
    },
  },
  reviews: {
    // Only fetch the rating number — super cheap
    select: {
      rating: true,
    },
  },
};

// Static base include for Variant (no functions)
const variantBaseInclude: Prisma.VariantInclude = {
  size: true,
  color: true,
  images: {
    orderBy: { createdAt: Prisma.SortOrder.asc }, // Added: Sort images consistently
  },
  variantPrices: {
    include: {
      locationGroup: {
        include: { locations: true },
      },
    },
  },
  variantSpecifications: {
    include: {
      specificationField: {
        include: { group: true },
      },
    },
  },
};

/* ---------- GET PRODUCTS LIST ---------- */
export async function productsList(
  query: ProductQuery,
  storeId: string
): Promise<{ products: any[]; totalCount: number }> {

  const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : (query.limit ?? 12);
  const page = typeof query.page === 'string' ? parseInt(query.page, 10) : (query.page ?? 1);
  const parsedLimit = isNaN(limit) ? 12 : Math.max(1, limit);
  const parsedPage = Math.max(1, isNaN(page) ? 1 : page);
  const parsedPincode = typeof query.pincode === 'string' ? parseInt(query.pincode, 10) : query.pincode;

  const {
    categoryId,
    subCategoryId,
    brandId,
    colorId,
    sizeId,
    isFeatured,
    type,
    price,
    variantIds = [],
    rating,
    discount,
    selectFields,
    locationGroupId,
    pincode = parsedPincode,
  } = query;

  let where: Prisma.ProductWhereInput = {
    storeId,
    isArchieved: false,
  };

  // Base filters
  if (categoryId) where.categoryId = categoryId;
  if (subCategoryId) where.subCategoryId = subCategoryId;
  if (brandId) where.brandId = brandId;
  if (type) where.type = type;
  if (isFeatured !== undefined) where.isFeatured = isFeatured;

  // Variant filters
  if (colorId || sizeId || variantIds.length > 0) {
    where.variants = {
      some: {
        ...(colorId && { colorId }),
        ...(sizeId && { sizeId }),
        ...(variantIds.length > 0 && { id: { in: variantIds } }),
      },
    };
  }

  // Price filter
  if (price) {
    let minPrice: number | undefined;
    let maxPrice: number | undefined;
    if (price === "5000") minPrice = 5000;
    else {
      const [min, max] = price.split("-").map((p) => parseInt(p, 10));
      if (!isNaN(min)) minPrice = min;
      if (!isNaN(max)) maxPrice = max;
    }
    if (minPrice || maxPrice) {
      where.variants = {
        some: {
          ...(where.variants?.some || {}),
          variantPrices: {
            some: {
              ...(locationGroupId && { locationGroupId }),
              price: {
                ...(minPrice && { gte: minPrice }),
                ...(maxPrice && { lte: maxPrice }),
              },
            },
          },
        },
      };
    }
  }

  let resolvedLocationGroupId = locationGroupId;
  if (pincode && !locationGroupId) {
    const loc = await db.location.findUnique({
      where: { pincode: pincode.toString(), storeId },
      select: { locationGroupId: true },
    });
    if (!loc?.locationGroupId) throw new Error("Invalid pincode");
    resolvedLocationGroupId = loc.locationGroupId;
  }

  // Handle generateStaticParams case (unchanged)
  if (selectFields?.includes('variants.slug')) {
    const products = await db.product.findMany({
      where,
      select: {
        id: true,
        variants: {
          select: { slug: true },
        },
      },
    });
    const slugs = products.flatMap(p => p.variants.map(v => ({ slug: v.slug })));
    return { products: slugs as any[], totalCount: slugs.length };
  }

  const hasPostFilter = !!rating || !!discount;
  const take = hasPostFilter ? undefined : parsedLimit;
  const skip = hasPostFilter ? 0 : (parsedPage - 1) * parsedLimit;

  // Fetch with lightweight include + minimal reviews
  const products = await db.product.findMany({
    where,
    orderBy: { createdAt: Prisma.SortOrder.desc },
    skip,
    take,
    include: productListInclude,
  });

  // Process products to match your ProductCard expectations
  const processedProducts = products.map((product: any) => {
    const firstVariant = product.variants[0];

    // Compute average rating from reviews (only rating field fetched)
    const ratings = product.reviews.map((r: { rating: number }) => r.rating);
    const numberOfRatings = ratings.length;
    const averageRating = numberOfRatings > 0
      ? Number((ratings.reduce((a, b) => a + b, 0) / numberOfRatings).toFixed(2))
      : 0;

    // Handle variant price fallback (same logic as your card)
    let selectedPrice = firstVariant?.variantPrices.find(
      (vp: any) => vp.locationGroupId === resolvedLocationGroupId && vp.price > 0
    );

    if (!selectedPrice && firstVariant?.variantPrices) {
      selectedPrice = firstVariant.variantPrices.find((vp: any) => vp.price > 0);
    }

    const cardVariant = firstVariant
      ? {
          ...firstVariant,
          images: firstVariant.images || [],
          variantPrices: firstVariant.variantPrices || [],
        }
      : null;

    return {
      ...product,
      variants: cardVariant ? [cardVariant] : [],
      averageRating,
      numberOfRatings,
      reviews: undefined, // Clean up — not needed anymore
    };
  });

  // Apply post-filters
  let filtered = processedProducts;

  if (hasPostFilter) {
    if (rating) {
      filtered = filtered.filter(p => p.averageRating >= parseFloat(rating));
    }
    if (discount) {
      filtered = filtered.filter((p: any) => {
        const prices = p.variants[0]?.variantPrices || [];
        return prices.some((vp: any) => {
          if (vp.mrp <= vp.price) return false;
          const discountPercent = Math.round(((vp.mrp - vp.price) / vp.mrp) * 100);
          return discountPercent >= parseFloat(discount);
        });
      });
    }
  }

  const totalCount = hasPostFilter ? filtered.length : await db.product.count({ where });

  const finalProducts = hasPostFilter
    ? filtered.slice((parsedPage - 1) * parsedLimit, parsedPage * parsedLimit)
    : processedProducts;

  return { products: finalProducts, totalCount };
}

/* ---------- GET HOT DEALS ---------- */
export async function hotDeals(
  query: HotDealsQuery,
  storeId: string
): Promise<Product[]> {
  // Reuse productsList logic (simplified)
  const { categoryId, limit = 10, page = 1, timeFrame = "all time" } = query;
  const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
  const parsedPage = typeof page === 'string' ? parseInt(page, 10) : page;

  const { products } = await productsList(
    { categoryId, limit: parsedLimit, page: parsedPage, isFeatured: true },
    storeId
  );

  return products as Product[]; // Type assertion after processing
}

/* ---------- GET PRODUCT BY SLUG ---------- */
export async function productBySlug(
  storeId: string,
  slug: string,
  includeRelated?: boolean,
  locationGroupId?: string
): Promise<any> {
  // Validate slug (fixes invalid image slugs)
  if (!slug || slug.includes('.') || slug.includes('/')) {
    console.warn(`[INVALID SLUG] Skipping fetch for: ${slug}`);
    throw new Error("Product not found"); // Or return null for graceful handling
  }

  const variantPricesWhere = locationGroupId ? { locationGroupId } : {};

  const variantData = await db.variant.findUnique({
    where: { slug },
    include: {
      product: {
        include: productBaseInclude,
      },
      ...variantBaseInclude,
      variantPrices: {
        where: variantPricesWhere,
        ...variantBaseInclude.variantPrices,
      },
    },
  });

  if (!variantData || !variantData.product) throw new Error("Product not found");

  const product = variantData.product;
  if (product.storeId !== storeId || product.isArchieved) throw new Error("Product not found");

  const ratings = product.reviews.map((r: any) => r.rating);
  const numRatings = ratings.length;
  const avgRating = numRatings > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / numRatings : 0;

  const { reviews, variants, ...productWithoutVariantsAndReviews } = product;

  let relatedProducts: any[] = [];
  if (includeRelated && product.categoryId) {
    relatedProducts = await db.product.findMany({
      include: productBaseInclude,
      where: { categoryId: product.categoryId, id: { not: product.id }, isArchieved: false },
      take: 4,
      orderBy: { createdAt: Prisma.SortOrder.desc },
    }).then((prods) =>
      prods.map((p: any) => {
        const ratings = p.reviews.map((r: any) => r.rating);
        const numRatings = ratings.length;
        const avgRating = numRatings > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / numRatings : 0;
        const { reviews, ...pp } = p;
        return { ...pp, averageRating: Number(avgRating.toFixed(2)), numberOfRatings: numRatings };
      })
    );
  }

  const allVariants = variants.map((v: any) => ({
    id: v.id,
    title: v.name,
    slug: v.slug,
    color: v.color?.name || null,
    size: v.size?.value || null,
    sizeId: v.size?.id,
    colorId: v.color?.id,
    // Added: Include images if needed for UI previews
    images: v.images?.map((img: any) => img.url) || [],
  }));

  return {
    variant: { ...variantData, product: undefined },
    product: { ...productWithoutVariantsAndReviews, averageRating: Number(avgRating.toFixed(2)), numberOfRatings: numRatings },
    allVariants,
    ...(includeRelated && { relatedProducts }),
  };
}

/* ---------- GET PRODUCT BY ID ---------- */
export async function productById(
  storeId: string,
  id: string,
  includeRelated?: boolean,
  locationGroupId?: string
): Promise<any> {
  const variantPricesWhere = locationGroupId ? { locationGroupId } : {};

  const product = await db.product.findUnique({
    where: { id, storeId, isArchieved: false },
    include: {
      ...productBaseInclude,
      variants: {
        ...productBaseInclude.variants,
        include: {
          ...variantBaseInclude,
          variantPrices: {
            where: variantPricesWhere,
            ...variantBaseInclude.variantPrices,
          },
        },
      },
    },
  });

  if (!product) throw new Error("Product not found");

  const ratings = product.reviews.map((r: any) => r.rating);
  const numRatings = ratings.length;
  const avgRating = numRatings > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / numRatings : 0;

  const { reviews, ...productWithoutReviews } = product;

  let relatedProducts: any[] = [];
  if (includeRelated && product.categoryId) {
    relatedProducts = await db.product.findMany({
      include: productBaseInclude,
      where: { categoryId: product.categoryId, id: { not: product.id }, isArchieved: false },
      take: 4,
      orderBy: { createdAt: Prisma.SortOrder.desc },
    }).then((prods) =>
      prods.map((p: any) => {
        const ratings = p.reviews.map((r: any) => r.rating);
        const numRatings = ratings.length;
        const avgRating = numRatings > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / numRatings : 0;
        const { reviews, ...pp } = p;
        return { ...pp, averageRating: Number(avgRating.toFixed(2)), numberOfRatings: numRatings };
      })
    );
  }

  return {
    ...productWithoutReviews,
    averageRating: Number(avgRating.toFixed(2)),
    numberOfRatings: numRatings,
    ...(includeRelated && { relatedProducts }),
  };
}

/* ---------- GET RECENTLY VIEWED ---------- */
export async function recentlyViewedProducts(
  storeId: string,
  productIds: string[],
  locationGroupId?: string
): Promise<Product[]> {
  if (!productIds.length) throw new Error("Product IDs required");

  const variantPricesWhere = locationGroupId ? { locationGroupId } : {};

  const products = await db.product.findMany({
    where: { id: { in: productIds }, storeId, isArchieved: false },
    include: {
      ...productBaseInclude,
      variants: {
        ...productBaseInclude.variants,
        include: {
          ...variantBaseInclude,
          variantPrices: {
            where: variantPricesWhere,
            ...variantBaseInclude.variantPrices,
          },
        },
      },
    },
    orderBy: { createdAt: Prisma.SortOrder.desc },
  });

  return products.map((product: any) => {
    const ratings = product.reviews.map((r: any) => r.rating);
    const numRatings = ratings.length;
    const avgRating = numRatings > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / numRatings : 0;
    const { reviews, ...p } = product;
    return { ...p, averageRating: Number(avgRating.toFixed(2)), numberOfRatings: numRatings };
  });
}