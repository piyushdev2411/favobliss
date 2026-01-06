import { db } from "@/lib/db";
import { Size } from "@/types";

export async function allSizes(storeId: string): Promise<Size[]> {
  return await db.size.findMany({
    where: { storeId },
  });
}
