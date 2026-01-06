import { db } from "@/lib/db";
import { Color } from "@/types";

export async function allColors(storeId: string): Promise<Color[]> {
  return await db.color.findMany({
    where: { storeId },
  });
}
