// lib/invoice.ts
import { db } from "@/lib/db";
import { InvoiceData } from "@/types";

export async function invoiceByOrderId(
  orderId: string
): Promise<InvoiceData> {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      orderProducts: {
        include: {
          variant: {
            include: {
              product: true,
              variantPrices: true,
            },
          },
        },
      },
    },
  });

  if (!order) throw new Error("Order not found");

  const items = order.orderProducts.map((item) => {
    const unitPrice =
      item.variant.tax !== 0 && item.variant.tax !== null
        ? item.price - (item.price * item.variant.tax) / 100
        : item.price || 0;
    const unitDisc = 0;
    const taxableValue = unitPrice * item.quantity;
    const igstRate =
      item.variant.tax !== 0 && item.variant.tax !== null
        ? item.variant.tax / 100
        : 0;
    const igst = taxableValue * igstRate;
    const total = taxableValue + igst;

    return {
      description: item.name || item.variant.name || "Unknown Product",
      hsn: item.variant.hsn || "N/A",
      sku: item.variant.sku || "N/A",
      qty: item.quantity,
      unitPrice,
      unitDisc,
      taxableValue,
      igst,
      total,
    };
  });

  const netTotal = items.reduce((sum, item) => sum + item.taxableValue, 0);

  return {
    soldBy: {
      company: "Favobliss Infotech Pvt Ltd",
      address:
        "246/59, EAST SCHOOL BLOCK, NEAR ALLAH COLONY MANDAWALI, East Delhi, Delhi 110092",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      stateCode: "07",
      phone: "8920466675",
      gstin: "07AACCF6639H1ZI",
      invoiceNo: order.invoiceNumber || "Pending",
      invoiceDate: order.updatedAt.toISOString().split("T")[0],
      orderNo: order.orderNumber || "Pending",
      orderDate: order.createdAt.toISOString().split("T")[0],
    },
    deliveredTo: {
      name: order.customerName || "Unknown Customer",
      address: order.address || "",
      city: order.zipCode ? "Delhi" : "",
      state: order.zipCode ? "Delhi" : "",
      country: "India",
      stateCode: order.zipCode ? "07" : "",
      paymentMethod: order.isPaid ? "Prepaid" : "Cash on Delivery",
      shippedBy: "Delhivery Surface 5kg",
      awbNo: "1504863793810",
      waybillNo: "",
    },
    items,
    netTotal,
  };
}
