import { getProducts } from "@/actions/get-products";
import HeroSlider from "@/components/store/billboard";
import { HotDealBanner } from "@/components/store/hotDealBanner";
import { ProductList } from "@/components/store/product-list";
import { Container } from "@/components/ui/container";
import { CategorySlider } from "@/components/home/category-slider";
import GalleryImage from "@/components/store/GalleryImage";
import { getBrands } from "@/actions/get-brands";
import BrandList from "@/components/store/BrandList";
import { getCategories } from "@/actions/get-categories";
import {
  applianceItems,
  brandItems,
  kitchenAppliance,
  premiumProducts,
} from "@/utils/constant";
import PremiumProductsSection from "@/components/PremiumProductSection";
import FourImageGrid from "@/components/store/FourImageGrid";
import FeatureHighlights from "@/components/store/FeatureHighlights";
import PromotionalBanner from "@/components/store/PromotionalBanner";
import RecentlyViewed from "@/components/store/RecentlyViewed";
import { getLocationGroups } from "@/actions/get-location-group";
import HomeAppliance from "@/components/store/HomeAppliance";
import BannerProductSection from "@/components/store/BannerProductSection";
import BannerImage from "@/components/store/BannerImage";
import HeroSliderMobile from "@/components/store/billboardMobile";
import Head from "next/head";
import { getHomepageCategory } from "@/actions/get-homepage-categories";
import { HotProductsSection } from "@/actions/get-hotproduct";

export const revalidate = 600;

const LandingPage = async ({ params }: { params: { storeId: string } }) => {
  const results = await Promise.allSettled([
    getProducts(),
    getProducts({ isFeatured: true }),
    getCategories(),
    getLocationGroups(),
    getBrands(),
    getHomepageCategory(),
    HotProductsSection()
  ]);

  // Extract results with fallback values for rejected promises
  const [
    allProductsResult,
    featuredResult,
    categoriesResult,
    locationGroupsResult,
    brandsResult,
    homepageCategoriesResult,
    hotProductsResult
  ] = results;

  const allProducts =
    allProductsResult.status === "fulfilled"
      ? allProductsResult.value.products
      : [];
  const featured =
    featuredResult.status === "fulfilled" ? featuredResult.value.products : [];
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const locationGroups =
    locationGroupsResult.status === "fulfilled"
      ? locationGroupsResult.value
      : [];
  const brands = brandsResult.status === "fulfilled" ? brandsResult.value : [];
  const homepageCategories =
    homepageCategoriesResult.status === "fulfilled"
      ? homepageCategoriesResult.value
      : [];
  const hotProductsSection =
    hotProductsResult.status === "fulfilled"
      ? hotProductsResult.value
      : null;

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/assets/hero/banner-boat.jpg"
          as="image"
          fetchPriority="high"
        />
      </Head>
      <div className="bg-[#f8f8f8] min-h-screen">
        <HeroSlider />
        <HeroSliderMobile />
        <CategorySlider categories={categories} />
        <GalleryImage />
        <Container>
          <div className="space-y-10 pb-20 mt-8">
            <div className="flex flex-col gap-y-4 md:gap-y-12 px-4 sm:px-6 lg:px-8">
              <BannerProductSection
                locationGroups={locationGroups}
                products={hotProductsSection?.products || []}
                bannerImage={hotProductsSection?.bannerImage || "/assets/gaming.jpg"}
              />
              <RecentlyViewed locationGroups={locationGroups} />
              <ProductList
                title="Latest Launches"
                data={allProducts}
                locationGroups={locationGroups}
                showViewAll={true}
                link="/latest-launches?page=1"
              />
              <PromotionalBanner
                locationGroups={locationGroups}
                categories={homepageCategories}
              />
              <FourImageGrid />
              {/* <div className="space-y-4 md:space-y-16">
              <Image
                src="/assets/banner.jpg"
                alt="Image"
                width={1500}
                height={300}
                className="object-cover bg-blend-color-burn"
              />
            </div> */}
              {/* <LandingPageSection
              title="Home Appliances"
              items={applianceItems}
              viewAllLink="/category/home-appliances?page=1"
              className="mx-auto bg-[#d8d8d8]"
            />
            <ProductList
              title=""
              data={homeApplicance || []}
              locationGroups={locationGroups}
            /> */}
              <HomeAppliance
                title="Home Appliances"
                categoryId="6843219ac338ba8cc9db1e72"
                locationGroups={locationGroups}
                link="/category/home-appliances?page=1"
                items={applianceItems}
                className="bg-[#e1e8d4]"
              />
              <HomeAppliance
                title="Kitchen Appliances"
                categoryId="684321aac338ba8cc9db1e73"
                locationGroups={locationGroups}
                link="/category/kitchen-appliances?page=1"
                items={kitchenAppliance}
                className="bg-[#c5aa94]"
              />
              <BannerImage
                imageUrl="/assets/banner-boat.jpg"
                altText="banner"
              />
              <HomeAppliance
                title="Blissful Upgrades"
                categoryId="684321d4c338ba8cc9db1e75"
                locationGroups={locationGroups}
                // link="/category/kitchen-appliances?page=1"
                items={brandItems}
                className="bg-[#c5aa94]"
              />
              {/* <LandingPageSection
              title="Kitchen Appliances"
              items={kitchenAppliance}
              viewAllLink="/category/kitchen-appliances?page=1"
              className="mx-auto bg-[#b8e0ee]"
            />
            <ProductList
              title=""
              data={kitchen || []}
              locationGroups={locationGroups}
            /> */}
              {/* <BestOfProduct
              products={brandProducts || []}
              title="Best of Apple"
              subtitle="Save up to ₹10,000 instantly on eligible products using ICICI, Axis or Kotak Mahindra Bank Credit Cards | Exchange bonus upto ₹6,000 on iPhone"
              offer="Benefit with No Cost EMI schemes"
            /> */}
              <PremiumProductsSection
                products={premiumProducts}
                backgroundColor="#534747"
              />
              <ProductList
                title="Favobliss's Choice"
                data={featured || []}
                locationGroups={locationGroups}
                showViewAll={true}
                link="/favobliss-choice?page=1"
              />
              <BrandList brands={Array.isArray(brands) ? brands : [brands]} />
              <HotDealBanner />
              {/* <LatestLaunches /> */}
              <FeatureHighlights />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default LandingPage;
