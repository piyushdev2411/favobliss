import { db } from "@/lib/db";

export async function getOrder(orderId: string) {
  if (!orderId || orderId.length !== 24) {
    throw new Error("Invalid storeId or orderId: Must be valid 24-character ObjectIds");
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      orderProducts: {
        include: {
          variant: {
            include: {
              product: true,
              size: true,
              color: true,
              variantPrices: true,
            },
          },
        },
      },
    },
  });
  return order;
}