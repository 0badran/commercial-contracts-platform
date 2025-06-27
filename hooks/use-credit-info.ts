"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

type CreditInfo = Database["credit_info"];

export function useCreditInfo() {
  const supabase = createClient();
  const {
    data,
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["credit_info"],
    queryFn: async () =>
      supabase
        .from("credit_info")
        .select("*")
        .order("created_at", { ascending: false }),
  });

  const creditInfo: CreditInfo[] = data?.data || [];

  const getCreditById = (id: string) => {
    if (!creditInfo) {
      return null;
    }
    return creditInfo.find((credit) => credit.retailer_id === id) || null;
  };
  return {
    creditInfo,
    loading,
    error,
    refetch,
    getCreditById,
  };
}
