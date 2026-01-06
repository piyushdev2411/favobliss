"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/store/product-card";
import { NoResults } from "@/components/store/no-results";
import { PaginationComponent } from "@/components/store/_components/pagination";
import { LocationGroup, Product } from "@/types";

interface ProductListClientProps {
  fixedQuery: {
    categoryId?: string;
    subCategoryId?: string;
    brandId?: string;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    type?: "MEN" | "WOMEN";
  };
  filteredSizes: any[];
  colors: any[];
  brands: any[];
  locationGroups: LocationGroup[];
  priceRanges: any[];
  ratingRanges: any[];
  discountRanges: any[];
  description?: string;
}

export default function ProductListClient({
  fixedQuery,
  filteredSizes,
  colors,
  brands,
  locationGroups,
  priceRanges,
  ratingRanges,
  discountRanges,
  description,
}: ProductListClientProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const totalPages = Math.ceil(totalCount / 12);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(fixedQuery).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, typeof value === "boolean" ? value.toString() : value);
      }
    });

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotalCount(data.totalCount || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams]);

  if (loading) return <div className="text-center py-10">Loading products...</div>;

  return (
    <>
      {products.length === 0 ? (
        <NoResults />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10">
          {products.flatMap((product) =>
            product.variants.map((variant: any) => (
              <ProductCard
                key={variant.id}
                data={product}
                variant={variant}
                locationGroups={locationGroups}
              />
            ))
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="w-full flex items-center justify-center pt-12">
          <PaginationComponent currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}

      {description && <p className="mt-10 text-gray-700 text-sm">{description}</p>}
    </>
  );
}