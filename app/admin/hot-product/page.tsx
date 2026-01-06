import { HotProductForm } from "@/components/admin/store/forms/hot-product-form";
import { db } from "@/lib/db";

export const metadata = { title: "Hot Products Banner" };

export default async function HotProductsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const section = await db.hotProductsSection.findFirst({
    where: { storeId: params.storeId },
    include: {
      products: {
        include: { product: true },
        orderBy: { position: "asc" },
      },
    },
  });

  const products = await db.product.findMany({
    where: { storeId: params.storeId },
    include: { variants: { include: { images: true }, take: 1 } },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HotProductForm initialData={section} allProducts={products} />
      </div>
    </div>
  );
}
