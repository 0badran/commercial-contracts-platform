"use client";

import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";

type CreditInfo = Database["credit_info"];

export function useCreditInfo(retailerId: string | null) {
  const supabase = createClient();
  const [creditInfo, setCreditInfo] = useState<CreditInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCreditInfo = useCallback(async () => {
    if (!retailerId) {
      return setError(new Error("Retailer id is missing"));
    }
    setLoading(true);
    setError(null);

    const { data, error: sbError } = await supabase
      .from("credit_info")
      .select("*")
      .eq("user_id", retailerId)
      .single();

    setLoading(false);

    if (sbError) {
      setError(sbError);
      setCreditInfo(null);
      return { data: null, error: sbError };
    }

    setCreditInfo(data || null);
    return { data: data || null, error: null };
  }, [retailerId, supabase]);

  useEffect(() => {
    fetchCreditInfo();
  }, [fetchCreditInfo]);

  return {
    creditInfo,
    loading,
    error,
    refetch: fetchCreditInfo,
  };
}
