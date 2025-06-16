"use client";

import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";
import useUser from "./use-user";

type Contract = Database["contract"];

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const supabase = createClient();

  const fetchContracts = useCallback(async () => {
    const userId = user?.id;
    const userType: UserType = user?.user_metadata.user_type;
    setLoading(true);
    setError(null);
    const { data } = await supabase
      .from("contracts")
      .select("*")
      .eq(`${userType}_id`, userId)
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      return setError(error);
    }
    setContracts(data || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, supabase]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const createContract = async (contract: Contract) => {
    const { data, error } = await supabase
      .from("contracts")
      .insert(contract)
      .select()
      .single();

    if (error) return { error, data: null };

    setContracts((prev) => [data, ...prev]);
    return { data, error: null };
  };

  const updateContract = async (id: string, updates: Contract) => {
    try {
      const { data, error } = await supabase
        .from("contracts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setContracts((prev) =>
        prev.map((contract) => (contract.id === id ? data : contract))
      );
      return data;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "حدث خطأ في تحديث العقد"
      );
    }
  };

  return {
    contracts,
    loading,
    error,
    createContract,
    updateContract,
    refetch: fetchContracts,
  };
}
