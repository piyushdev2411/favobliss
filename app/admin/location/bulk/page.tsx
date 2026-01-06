import { LocationBulkImport } from "@/components/admin/store/forms/location-bulk-import";
import { db } from "@/lib/db";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Store | Locations Bulk",
};

const page = async ({ params }: { params: { storeId: string } }) => {
  const locationGroups = await db.locationGroup.findMany({
    select: { id: true, name: true },
  });
  return <LocationBulkImport groups={locationGroups} />;
};

export default page;
