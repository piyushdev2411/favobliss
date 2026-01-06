"use server";

import nodemailer from "nodemailer";
import { getOrder } from "./getOrder";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOrderEmail(formData: FormData) {
  try {
    const orderId = formData.get("orderId") as string;
    const subject = formData.get("subject") as string;
    const body = formData.get("body") as string;
    const file = formData.get("attachment") as File | null;

    if (!subject || !body) {
      return { success: false, error: "Subject and body are required" };
    }

    if (!orderId || orderId.length !== 24) {
      return { success: false, error: "Invalid order or store ID provided" };
    }

    const order = await getOrder(orderId);
    if (!order || !order.customerEmail) {
      return { success: false, error: "Order or customer email not found" };
    }

    let attachments: any[] = [];
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      attachments = [
        {
          filename: file.name,
          content: buffer,
          contentType: file.type || "application/octet-stream",
        },
      ];
    }

    await transporter.sendMail({
      from: process.env.EMAIL!,
      to: order.customerEmail,
      subject,
      html: body,
      attachments,
    });

    // Optional: Revalidate the order page
    // revalidatePath(`/admin/orders/${storeId}/${orderId}`);

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: (error as Error).message };
  }
}