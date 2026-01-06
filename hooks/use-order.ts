import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import {
  Order,
  OrderProduct,
  Comment,
  ShippingAddress,
  OrderStatus,
} from "@prisma/client";

export interface EnrichedOrder extends Order {
  orderProducts: (OrderProduct & { comment: Comment | null })[];
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  estimatedDeliveryDays: number | null;
  orderNumber: string | null;
}

export const useOrder = () => {
  const { data, error, isLoading, mutate } = useSWR<EnrichedOrder[]>(
    "/api/v1/order",
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnReconnect: true,
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
