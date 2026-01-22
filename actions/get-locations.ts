import { cache } from "react";
import { LocationGroup, Location } from "@/types";
import { allLocations, locationById, locationByPincode } from "@/data/functions/locations";
import { unstable_cache } from "next/cache";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

// Cache keys
const LOCATION_GROUPS_KEY = `location-groups-${STORE_ID}`;
const locationGroupNameKey = (name: string) => `location-group-name-${name}-${STORE_ID}`;
const locationGroupIdKey = (id: string) => `location-group-id-${id}`;
const LOCATIONS_KEY = `locations-${STORE_ID}`;
const locationPincodeKey = (pincode: string) => `location-pincode-${pincode}-${STORE_ID}`;
const locationIdKey = (id: string) => `location-id-${id}`;

/* ---------- LOCATIONS ---------- */
export const getLocations = unstable_cache(async (): Promise<Location[]> => {
  console.log(`[CACH MISS] Fetching locations`);
  return await allLocations(STORE_ID);
});

export const getLocationByPincode = unstable_cache(
  async (pincode: string): Promise<Location | null> => {
    console.log(`[CACHE MISS] Fetching location by pincode: ${pincode}`);
    return await locationByPincode(STORE_ID, pincode);
  }
);

export const getLocationById = unstable_cache(
  async (id: string): Promise<Location | null> => {
    console.log(`[CACHE MISS] Fetching location by id: ${id}`);
    return await locationById(id);
  }
);