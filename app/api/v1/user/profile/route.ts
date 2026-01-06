// New API route: app/api/user/profile/route.ts
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const UserUpdateSchema = z.object({
  name: z.string().optional(),
  mobileNumber: z.string().nullable().optional(),
  dob: z.coerce.date().nullable().optional(),
});

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const validated = UserUpdateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const updated = await db.user.update({
      where: { id: session.user.id },
      data: validated.data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("USER PROFILE PATCH API", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
