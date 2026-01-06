// lib/locations.ts
import { db } from "@/lib/db";
import { Location } from "@/types";

/* ---------- GET ALL LOCATIONS ---------- */
export async function allLocations(storeId: string): Promise<Location[]> {
  return await db.location.findMany({
    where: { storeId },
  });
}

/* ---------- GET BY PINCODE ---------- */
export async function locationByPincode(
  storeId: string,
  pincode: string
): Promise<Location | null> {
  return await db.location.findUnique({
    where: { pincode, storeId },
  });
}

/* ---------- GET BY ID ---------- */
export async function locationById(id: string): Promise<Location | null> {
  return await db.location.findUnique({
    where: { id },
  });
}