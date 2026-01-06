export const dynamic = 'force-dynamic';

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("x-razorpay-signature") as string;

  let event;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Webhook signature verification failed");
      return new NextResponse("Invalid webhook signature", { status: 400 });
    }

    event = JSON.parse(body);
  } catch (error: any) {
    console.error("Webhook parsing error:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.event === "order.paid") {
    const payment = event.payload.payment.entity;
    const orderId = payment.notes?.id;

    if (!orderId) {
      console.error("Order ID not found in webhook");
      return new NextResponse("Order ID not found in webhook", { status: 400 });
    }

    const existingOrder = await db.order.findUnique({
      where: { id: orderId },
      include: { orderProducts: true },
    });

    if (!existingOrder) {
      console.error(`Order not found: ${orderId}`);
      return new NextResponse(`Order not found: ${orderId}`, { status: 404 });
    }

    if (existingOrder.isPaid) {
      console.log(`Order ${orderId} is already paid`);
      return new NextResponse(null, { status: 200 });
    }

    let addressString = "";
    try {
      if (payment.notes?.address) {
        const address = JSON.parse(payment.notes.address);
        addressString = [
          address.address || "",
          address.landmark || "",
          address.town || "",
          address.district || "",
          address.state || "",
          address.zipCode || "",
        ]
          .filter(Boolean)
          .join(", ");
      }
    } catch (error) {
      console.error("Error parsing address:", error);
    }

    await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          status: "PENDING",
          address:
            addressString || existingOrder.address || "No address provided",
          phone: payment.contact || existingOrder.phone || "No phone provided",
        },
      });

      // Reduce stock (if not done earlier)
      for (const item of existingOrder.orderProducts) {
        await tx.variant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    });

    return new NextResponse(null, { status: 200 });
  }

  console.log("Unhandled event type:", event.event);
  return new NextResponse(null, { status: 200 });
}
