"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import TagManager from "react-gtm-module";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID as string | undefined;

export default function GTMClient() {
  const initRef = useRef(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize GTM only once on client
  useEffect(() => {
    if (!GTM_ID) {
      console.warn("NEXT_PUBLIC_GTM_ID is not set");
      return;
    }
    if (initRef.current) return;
    try {
      TagManager.initialize({ gtmId: GTM_ID });
      initRef.current = true;
      // Optionally push initial page view after initialization
      //@ts-ignore
      window.dataLayer?.push({
        event: "page_view",
        page_path: window.location.pathname + window.location.search,
      });
    } catch (err) {
      console.error("GTM init failed", err);
    }
  }, []);

  // Push SPA page view on route change
  useEffect(() => {
    // do nothing if GTM not initialized
    if (!initRef.current) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    //@ts-ignore
    window.dataLayer?.push({
      event: "page_view",
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}
