import { getColors } from "@/actions/get-colors";
import { getSizes } from "@/actions/get-sizes";
import { getBrands } from "@/actions/get-brands";
import { getLocationGroups } from "@/actions/get-location-group";
import { Container } from "@/components/ui/container";
import { Metadata, ResolvingMetadata } from "next";
import { PriceRange } from "@/types";
import Breadcrumb from "@/components/store/Breadcrumbs";
import SearchProductListClient from "@/components/store/SearchProductListCIient";
import { getSearchItem } from "@/actions/get-search-item";
import { NoResults } from "@/components/store/no-results";

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 100
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

interface SearchPageProps {
  searchParams: {
    query?: string;
    colorId?: string;
    sizeId?: string;
    page?: string;
    price?: string;
    brandId?: string;
    rating?: string;
    discount?: string;
  };
}

export async function generateMetadata(
  { searchParams }: SearchPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: "Search Result | Get Deals, Shop Now!",
    description:
      "Discover the newest styles & trends for every occasion. Shop Latest Launches products.",
    openGraph: {
      type: "website",
      images: [
        "https://res.cloudinary.com/dgcksrb1n/image/upload/v1749465423/qoujpnmfjabip1yrllvs.jpg",
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Latest Launches | Get Deals, Shop Now!",
      description:
        "Discover the newest styles & trends for every occasion. Shop Latest Launches products.",
      images: [
        "https://res.cloudinary.com/dgcksrb1n/image/upload/v1749465423/qoujpnmfjabip1yrllvs.jpg",
      ],
    },
    category: "ecommerce",
  };
}

const Search = async ({ searchParams }: SearchPageProps) => {
  const query = searchParams.query || "";

  // Fetch shared filter data server-side (static for the page shell)
  const [sizes, colors, brands, locationGroups] = await Promise.all([
    withRetry(() => getSizes()),
    withRetry(() => getColors()),
    withRetry(() => getBrands()),
    withRetry(() => getLocationGroups()),
  ]);

  // Lightweight fetch just to get classification for size filtering (limit=1, no filters)
  let classification = "TOPWEAR";
  if (query) {
    const baseKeyword = { query, limit: "1", page: 1 };
    const baseResults = await withRetry(() => getSearchItem(baseKeyword as any));
    classification = baseResults.products[0]?.category?.classification || "TOPWEAR";
  }

  const sizeMap: { [key: string]: string[] } = {
    TOPWEAR: ["S", "M", "L", "XL", "XXL"],
    BOTTOMWEAR: ["S", "M", "L", "XL", "XXL"],
    FOOTWEAR: ["6", "7", "8", "9", "10", "11"],
    INNERWEARANDSLEEPWEAR: ["S", "M", "L", "XL"],
    MAKEUP: [],
    SKINCARE: [],
    HAIRCARE: [],
    FRAGRANCES: [],
    TELEVISION: [],
  };

  const validSizes = sizeMap[classification] || [];
  const filteredSizes = sizes.filter((size) => validSizes.includes(size.name));

  const priceRange: PriceRange[] = [
    { id: "0-5000", name: "Rs. 0 to Rs. 5000", value: "0-5000" },
    { id: "5000-10000", name: "Rs. 5000 to Rs. 10000", value: "5000-10000" },
    { id: "10000-30000", name: "Rs. 10000 to Rs. 30000", value: "10000-30000" },
    { id: "30000-80000", name: "Rs. 30000 to Rs. 80000", value: "30000-80000" },
    { id: "80000", name: "Above Rs. 80000", value: "80000" },
  ];

  const ratingRanges = [
    { id: "4", name: "4★ & above", value: "4" },
    { id: "3", name: "3★ & above", value: "3" },
    { id: "2", name: "2★ & above", value: "2" },
    { id: "1", name: "1★ & above", value: "1" },
  ];

  const discountRanges = [
    { id: "70", name: "70% and above", value: "70" },
    { id: "60", name: "60% and above", value: "60" },
    { id: "50", name: "50% and above", value: "50" },
    { id: "40", name: "40% and above", value: "40" },
    { id: "30", name: "30% and above", value: "30" },
    { id: "20", name: "20% and above", value: "20" },
    { id: "10", name: "10% and above", value: "10" },
  ];

  const breadcrumbItems = query
    ? [{ label: query.toUpperCase(), href: `/search?query=${query}&page=1` }]
    : [];

  if (!query) {
    return (
      <div className="bg-white">
        <Container>
          <div className="px-4 sm:px-6 lg:px-8 pt-5 pb-24">
            <NoResults />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Breadcrumb items={breadcrumbItems} />
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 pt-5 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8 mt-14">
            {/* Filters are currently commented in your original code — keeping them disabled */}
            {/* If you want to enable them later, uncomment and pass props */}
            {/* <MobileFilters ... /> */}
            {/* <div className="hidden lg:block ..."> ...filters... </div> */}

            <div className="mt-6 lg:col-span-5 lg:mt-4 min-w-[90vw]">
              <SearchProductListClient
                searchQuery={query}
                locationGroups={locationGroups}
                filteredSizes={filteredSizes}
                colors={colors}
                brands={brands}
                priceRanges={priceRange}
                ratingRanges={ratingRanges}
                discountRanges={discountRanges}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Search;