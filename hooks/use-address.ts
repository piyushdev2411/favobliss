import fetcher from "@/lib/fetcher";
import { useSession } from "next-auth/react";
import { useMemo } from "react"; 
import useSWR from "swr";

export const useAddress = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoadingSession = status === "loading";

  const shouldFetch = isAuthenticated;

  const {
    data: rawData,
    error,
    isLoading: swrLoading,
    mutate,
  } = useSWR(shouldFetch ? "/api/v1/address" : null, fetcher, {
    revalidateIfStale: false,
    revalidateOnReconnect: true,
    revalidateOnFocus: false,
  });

  const data = useMemo(
    () => (shouldFetch ? rawData || [] : []),
    [rawData, shouldFetch]
  );

  return {
    data, 
    error,
    isLoading: swrLoading || isLoadingSession,
    mutate,
  };
};
