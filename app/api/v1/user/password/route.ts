// New API route: app/api/user/password/route.ts
// Note: Make sure to install bcryptjs if not already: npm install bcryptjs
// Import it as import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

const PasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = PasswordSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });
    if (!user || !user.password) {
      return new NextResponse("No password set", { status: 400 });
    }
    const match = await bcrypt.compare(
      validated.data.oldPassword,
      user.password
    );
    if (!match) {
      return new NextResponse("Incorrect old password", { status: 401 });
    }
    const hashed = await bcrypt.hash(validated.data.newPassword, 10);
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("USER PASSWORD POST API", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
