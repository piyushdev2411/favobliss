"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/store/product-card";
import { NoResults } from "@/components/store/no-results";
import { PaginationComponent } from "./_components/pagination";
import { LocationGroup } from "@/types";

interface SearchProductListClientProps {
  searchQuery: string;
  locationGroups: LocationGroup[];
  filteredSizes: any[];
  colors: any[];
  brands: any[];
  priceRanges: any[];
  ratingRanges: any[];
  discountRanges: any[];
}

export default function SearchProductListClient({
  searchQuery,
  locationGroups,
}: SearchProductListClientProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const totalPages = Math.ceil(totalProducts / 12);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("query", searchQuery);

    fetch(`/api/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotalProducts(data.pagination?.totalProducts || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams, searchQuery]);

  if (loading) return <div className="text-center py-10">Loading search results...</div>;

  return (
    <>
      {products.length === 0 ? (
        <NoResults />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10">
          {products.map((product: any) => (
            <ProductCard
              key={product.id}
              data={product}
              locationGroups={locationGroups}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="w-full flex items-center justify-center pt-12">
          <PaginationComponent currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </>
  );
}