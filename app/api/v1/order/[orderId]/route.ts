import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { action, isPaid }: { action?: "cancel"; isPaid?: boolean } =
      await request.json();
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const order = await db.order.findUnique({
      where: { id: params.orderId, userId: session.user.id },
      include: { orderProducts: true },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    if (action === "cancel") {
      if (order.isCompleted || order.status !== "PENDING") {
        return new NextResponse(
          `As Order status is now ${order.status} so order can't be canceled now!`,
          { status: 400 }
        );
      }

      await db.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: params.orderId },
          data: { status: "CANCELLED" },
        });

        // Restore stock
        for (const product of order.orderProducts) {
          await tx.variant.update({
            where: { id: product.variantId },
            data: { stock: { increment: product.quantity } },
          });
        }
      });

      return NextResponse.json({ success: true });
    }

    if (isPaid !== undefined) {
      await db.order.update({
        where: { id: params.orderId },
        data: { isPaid },
      });

      return NextResponse.json({ success: true });
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch (error) {
    console.error("ORDERS PATCH API", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
