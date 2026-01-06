import { HomepageCategoryForm } from "@/components/admin/store/forms/homepage-category-form";
import { db } from "@/lib/db";

const HomepageCategoryPage = async ({
  params,
}: {
  params: { storeId: string; homepageCategoryId: string };
}) => {
  let homepageCategory = null;

  if (params.homepageCategoryId !== "create") {
    homepageCategory = await db.homepageCategory.findUnique({
      where: {
        id: params.homepageCategoryId,
        storeId: params.storeId,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  const products = await db.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      variants: {
        include: {
          images: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HomepageCategoryForm data={homepageCategory} products={products} />
      </div>
    </div>
  );
};

export default HomepageCategoryPage;
