"use server";

import { db } from "@/lib/db";
import { OrderProduct, Comment, Order, ShippingAddress } from "@prisma/client";

export const getOrderProductById = async (
  id: string
): Promise<any | null> => {
  try {
    const orderProduct = await db.orderProduct.findUnique({
      where: { id },
      include: {
        comment: true,
        order: {
          include: {
            shippingAddress: true,
          },
        },
      },
    });

    return orderProduct;
  } catch (error) {
    console.error("FRONTEND GET ORDER PRODUCT BY ID", error);
    return null;
  }
};

export const getOrder = async (id: string): Promise<Order | null> => {
  try {
    const frontendOrder = await db.order.findUnique({
      where: { id },
      include: {
        orderProducts: {
          include: {
            comment: true,
          },
        },
        shippingAddress: true,
      },
    });
    return frontendOrder;
  } catch (error) {
    console.error("FRONTEND GET ORDER BY ID", error);
    return null;
  }
};
