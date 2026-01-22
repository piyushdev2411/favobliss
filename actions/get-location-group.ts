import { cache } from "react";
import { LocationGroup, Location } from "@/types";
import { allLocationGroups, locationGroupById, locationGroupByName } from "@/data/functions/locationGroup";
import { unstable_cache } from "next/cache";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

// Cache keys
const LOCATION_GROUPS_KEY = `location-groups-${STORE_ID}`;
const locationGroupNameKey = (name: string) => `location-group-name-${name}-${STORE_ID}`;
const locationGroupIdKey = (id: string) => `location-group-id-${id}`;
const LOCATIONS_KEY = `locations-${STORE_ID}`;
const locationPincodeKey = (pincode: string) => `location-pincode-${pincode}-${STORE_ID}`;
const locationIdKey = (id: string) => `location-id-${id}`;

/* ---------- LOCATION GROUPS ---------- */
export const getLocationGroups = unstable_cache(async (): Promise<LocationGroup[]> => {
  console.log(`[CACHE MISS] Fetching location groups`);
  return await allLocationGroups(STORE_ID);
});

export const getLocationGroupByName = unstable_cache(
  async (name: string): Promise<LocationGroup | null> => {
    console.log(`[CACHE MISS] Fetching location group by name: ${name}`);
    return await locationGroupByName(STORE_ID, name);
  }
);

export const getLocationGroupById = unstable_cache(
  async (id: string): Promise<LocationGroup | null> => {
    console.log(`[CACHE MISS] Fetching location group by id: ${id}`);
    return await locationGroupById(id);
  }
);

