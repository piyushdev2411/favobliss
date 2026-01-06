// Updated frontend: app/api/orders/route.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOrderNumber, generateInvoiceNumber } from "@/lib/utils";
import Razorpay from "razorpay";
import { CartSelectedItem } from "@/types";
import { Address } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const {
      products,
      address,
      paymentMethod,
      gstNumber,
      discount = 0,
      coupon,
    }: {
      products: CartSelectedItem[];
      address: Address;
      paymentMethod: "razorpay" | "cod";
      gstNumber?: string;
      discount: number;
      coupon?: { code: string; value: number };
    } = await request.json();

    if (!products || products.length === 0 || !address || !paymentMethod) {
      return new NextResponse("Invalid Credentials", { status: 400 });
    }

    if (gstNumber) {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(gstNumber)) {
        return new NextResponse("Invalid GST number format", { status: 400 });
      }
    }

    const storeId = "684315296fa373b59468f387";

    // Validate variants and stock
    const variantIds = products.map((p) => p.variantId);
    const variants = await db.variant.findMany({
      where: { id: { in: variantIds } },
      include: { variantPrices: true },
    });

    if (variants.length !== variantIds.length) {
      return new NextResponse("Some variants not found", { status: 400 });
    }

    for (const product of products) {
      const variant = variants.find((v) => v.id === product.variantId);
      if (!variant || variant.stock < product.quantity) {
        return new NextResponse(
          `Insufficient stock for variant ${product.variantId}`,
          { status: 400 }
        );
      }
    }

    let orderNumber: string;
    let invoiceNumber: string;
    try {
      orderNumber = await generateOrderNumber();
      invoiceNumber = await generateInvoiceNumber();
    } catch (error: any) {
      return new NextResponse(error.message, { status: 500 });
    }

    const mrp = products.reduce((total, p) => total + p.mrp * p.quantity, 0);
    const price = products.reduce(
      (total, p) => total + p.price * p.quantity,
      0
    );

    // Transaction: Create order, shipping, products, reduce stock
    const order = await db.$transaction(async (tx) => {
      const shippingAddress = await tx.shippingAddress.create({
        data: {
          name: address.name,
          address: address.address,
          district: address.district,
          landmark: address.landmark,
          mobileNumber: address.phoneNumber,
          state: address.state,
          town: address.town,
          zipCode: address.zipCode,
        },
      });

      const newOrder = await tx.order.create({
        data: {
          storeId,
          userId,
          shippingId: shippingAddress.id,
          isPaid: false,
          isCompleted: false,
          mrp,
          price: price - discount,
          discount,
          paymentMethod,
          phone: address.phoneNumber,
          address: [
            address.address,
            address.landmark,
            address.town,
            address.district,
            address.state,
            address.zipCode,
          ]
            .filter(Boolean)
            .join(", "),
          gstNumber,
          orderNumber,
          invoiceNumber,
          status: "PENDING",
          estimatedDeliveryDays: 3, // Calculate based on location if needed
          customerName: address.name,
          customerEmail: session?.user?.email || "",
          zipCode: address.zipCode.toString(),
          orderProducts: {
            create: products.map((p) => ({
              variantId: p.variantId,
              name: p.name,
              about: p.about,
              slug: p.slug,
              size: p.size || "",
              color: p.color || "",
              mrp: p.mrp,
              price: p.price,
              productImage: p.image,
              quantity: p.quantity,
            })),
          },
        },
      });

      // Reduce stock only for online payment; for COD, reduce on confirmation if needed
      if (paymentMethod === "razorpay") {
        for (const product of products) {
          await tx.variant.update({
            where: { id: product.variantId },
            data: { stock: { decrement: product.quantity } },
          });
        }
      }

      return newOrder;
    });

    let razorpayData = null;
    if (paymentMethod === "razorpay") {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      const amount = (price - discount) * 100;

      const razorCheckout = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: order.id,
        notes: { id: order.id, address: JSON.stringify(address) },
      });

      razorpayData = {
        orderId: razorCheckout.id,
        amount,
        currency: "INR",
        key: process.env.RAZORPAY_KEY_ID!,
      };
    }

    return NextResponse.json({
      orderId: order.id,
      razorpayData,
    });
  } catch (error) {
    console.error("ORDERS POST API", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(_request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json([]);
    }

    const orders = await db.order.findMany({
      where: { userId: session.user.id },
      include: {
        orderProducts: {
          include: { comment: true, variant: true },
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("ORDERS GET API", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

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
        return new NextResponse("Order cannot be canceled", { status: 400 });
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
