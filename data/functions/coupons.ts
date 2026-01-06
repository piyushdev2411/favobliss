import { db } from "@/lib/db";
import { Coupon } from "@prisma/client";

export async function allCoupons(storeId: string): Promise<Coupon[]> {
  return await db.coupon.findMany({
    where: { storeId },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });
}