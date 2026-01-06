// app/api/admin/[storeId]/location/bulk/route.ts
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

// Helper: Validate ObjectID (24 hex chars)
const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Helper: Extract & validate pincodes (handles space/comma-separated)
const extractPincodes = (rawData: any[][]): string[] => {
  return rawData
    .slice(1) // Skip header
    .flatMap((row: any[]) =>
      // Handle each cell in row; split by spaces/commas if needed
      row.flatMap((cell) => {
        const cellStr = String(cell || "").trim();
        if (!cellStr) return [];
        return cellStr
          .split(/[\s,]+/) // Split by spaces OR commas
          .map((pin) => pin.trim())
          .filter((pin) => pin.length === 6 && /^\d{6}$/.test(pin)); // 6 digits only
      })
    )
    .filter((pin, index, self) => self.indexOf(pin) === index); // Dedupe
};

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const storeId = params.storeId;
    if (!storeId || !isValidObjectId(storeId)) {
      return new NextResponse("Invalid Store ID", { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const groupIdRaw = formData.get("locationGroupId") as string | null;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const country = formData.get("country") as string;

    if (!file) return new NextResponse("File is required", { status: 400 });
    if (
      !groupIdRaw ||
      groupIdRaw === "undefined" ||
      !isValidObjectId(groupIdRaw)
    ) {
      return new NextResponse("Valid Location Group ID is required", {
        status: 400,
      });
    }
    const groupId = groupIdRaw;
    if (!city || !state || !country) {
      return new NextResponse("City, State, Country are required", {
        status: 400,
      });
    }

    // Verify group exists and belongs to store
    const group = await db.locationGroup.findUnique({
      where: { id: groupId, storeId },
    });
    if (!group) {
      return new NextResponse("Invalid Location Group", { status: 400 });
    }

    // Read file
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return new NextResponse("Invalid file: No sheets found", { status: 400 });
    }
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Extract pincodes
    const pincodes = extractPincodes(rawData as any);
    console.log("[BULK] Extracted pincodes:", pincodes); // Debug: Check server console

    if (pincodes.length === 0) {
      return new NextResponse("No valid 6-digit pincodes found in file", {
        status: 400,
      });
    }

    // FIXED: No transaction – individual creates for partial success
    const created: any[] = [];
    const skipped: string[] = [];

    for (const pincode of pincodes) {
      // Global unique check (for @unique on pincode)
      let exists = await db.location.findUnique({
        where: { pincode },
      });

      // Optional: Also check composite (for @@unique)
      if (!exists) {
        exists = await db.location.findUnique({
          where: {
            storeId_pincode_city_state_country: {
              storeId,
              pincode,
              city,
              state,
              country,
            },
          },
        });
      }

      if (exists) {
        skipped.push(pincode);
        console.log(
          `[BULK] Skipped ${pincode} (exists globally or per-store/city)`
        );
        continue;
      }

      try {
        const location = await db.location.create({
          data: {
            pincode,
            city,
            state,
            country,
            storeId,
            locationGroupId: groupId, // Auto-connect to group
          },
        });
        created.push(location);
        console.log(`[BULK] Created ${pincode}`);
      } catch (createError: any) {
        if (createError.code === "P2002") {
          skipped.push(pincode);
          console.log(
            `[BULK] Skipped ${pincode} due to constraint:`,
            createError.meta?.target
          );
        } else {
          console.error(`[BULK] Failed ${pincode}:`, createError);
          skipped.push(pincode); // Skip on other errors too
        }
      }
    }

    const result = { created: created.length, skipped };

    return NextResponse.json({
      message: "Bulk import completed",
      ...result,
      totalProcessed: pincodes.length,
    });
  } catch (error: any) {
    console.error("[LOCATION_BULK_POST]", error);
    return new NextResponse(error.message || "Internal error", { status: 500 });
  }
}
