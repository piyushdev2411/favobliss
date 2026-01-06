import { getProductBySlug } from "@/actions/get-product";
import { getProducts } from "@/actions/get-products";
import { getLocationGroups } from "@/actions/get-location-group";
import { notFound } from "next/navigation"; 
import { Metadata, ResolvingMetadata } from "next";
import { ProductPageContent } from "@/components/store/ProductPageClient";

interface ProductPageProps {
  params: { slug: string };
}

export const revalidate = 600;

// Validate slug early (prevents image filenames like "placeholder-brand.png")
function isValidSlug(slug: string): any {
  return slug && typeof slug === 'string' && !slug.includes('.') && !slug.includes('/');
}

export async function generateStaticParams() {
  try {
    const { products } = await getProducts({ 
      selectFields: ["variants.slug"], 
      limit: 1000 // Number, parsed inside
    }); 
    
    if (!products?.length) { // Note: 'products' is flat array here
      console.warn("generateStaticParams: No products found");
      return [];
    }

    // Flatten and dedupe slugs (from variants across products)
    const uniqueSlugs = Array.from(
      new Set(products.map((item: { slug: string }) => item.slug).filter(Boolean))
    ).filter(isValidSlug); // Safety filter
    return uniqueSlugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return []; 
  }
}

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;

  // Early validation
  if (!isValidSlug(slug)) {
    console.warn(`[generateMetadata] Invalid slug: ${slug}`);
    return {
      title: "Product Not Found",
      description: "The requested product is not available.",
    };
  }

  try {
    const productData = await getProductBySlug(slug);
    if (!productData || !productData.variant) {
      return {
        title: "Product Not Found",
        description: "The requested product is not available.",
      };
    }

    const { variant } = productData;
    const previousImages = (await parent).openGraph?.images || [];

    const title = variant.metaTitle || `Buy ${variant.name}`;
    const description = variant.metaDescription || variant.description;
    const keywords = variant.metaKeywords?.length ? variant.metaKeywords : [];
    const ogImage =
      variant.openGraphImage ||
      variant.images?.[0]?.url ||
      "/placeholder-image.jpg";

    return {
      title,
      description,
      keywords,
      openGraph: {
        images: [
          {
            url: ogImage,
            height: 1200,
            width: 900,
          },
          ...previousImages,
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [
          {
            url: ogImage,
            height: 1200,
            width: 900,
          },
        ],
      },
      category: "ecommerce",
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    return {
      title: "Product Not Found",
      description: "The requested product is not available.",
    };
  }
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = params;

  // Early validation
  if (!isValidSlug(slug)) {
    console.warn(`[ProductPage] Invalid slug: ${slug}`);
    notFound();
  }

  try {
    const [productData, productsData, locationGroups] = await Promise.all([
      getProductBySlug(slug),
      getProducts({
        categoryId: "",
        limit: 10, // Number
      }).catch(() => ({ products: [], totalCount: 0 })),
      getLocationGroups().catch(() => []),
    ]);

    if (!productData || !productData.variant || !productData.allVariants?.length) {
      notFound(); 
    }

    const productsDataWithCategory = productData.product?.categoryId
      ? await getProducts({
          categoryId: productData.product.categoryId,
          limit: 10, // Number
        }).catch(() => ({ products: [], totalCount: 0 }))
      : { products: [], totalCount: 0 };

    const suggestProducts = productsDataWithCategory.products.filter(
      (item) => item.id !== productData.product.id
    );

    return (
      <ProductPageContent
        productData={productData}
        suggestProducts={suggestProducts}
        locationGroups={locationGroups}
      />
    );
  } catch (error) {
    console.error("Error in ProductPage:", error);
    notFound(); 
  }
};

export default ProductPage;