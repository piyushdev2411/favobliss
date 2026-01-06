// lib/location-groups.ts
import { db } from "@/lib/db";
import { LocationGroup } from "@/types";

const includeRelations = {
  include: {
    locations: true,
  },
};

/* ---------- GET ALL LOCATION GROUPS ---------- */
export async function allLocationGroups(storeId: string): Promise<any[]> {
  return await db.locationGroup.findMany({
    where: { storeId },
    ...includeRelations,
  });
}

/* ---------- GET BY NAME ---------- */
export async function locationGroupByName(
  storeId: string,
  name: string
): Promise<any | null> {
  return await db.locationGroup.findFirst({
    where: { name, storeId },
    ...includeRelations,
  });
}

/* ---------- GET BY ID ---------- */
export async function locationGroupById(id: string): Promise<any | null> {
  return await db.locationGroup.findUnique({
    where: { id },
    ...includeRelations,
  });
}
