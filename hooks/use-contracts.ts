"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

type Contract = Database["contract"];

export function useContracts(haveContracts?: Contract[]) {
  const [contracts, setContracts] = useState<Contract[]>(haveContracts || []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("contracts")
      .select("*")
      .order("created_at", { ascending: false });

    setLoading(false);

    if (fetchError) {
      setError(fetchError.message);
      return { data: [], error: fetchError };
    }
    setContracts(data || []);

    // Fetch current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUser(user);
    return { data: data || [], error: null };
  }, [supabase]);

  useEffect(() => {
    if (!haveContracts) {
      fetchContracts();
    }
  }, [fetchContracts, haveContracts]);

  // Create
  const createContract = async (
    contract: Omit<Contract, "id" | "created_at" | "updated_at">
  ) => {
    const { data, error: insertError } = await supabase
      .from("contracts")
      .insert(contract)
      .select()
      .single();

    if (insertError) {
      return { data: null, error: insertError };
    }

    setContracts((prev) => (data ? [data, ...prev] : prev));
    return { data, error: null };
  };

  // Update
  const updateContract = async (
    id: string,
    updates: Partial<Omit<Contract, "id" | "created_at" | "updated_at">>
  ) => {
    const { data, error: updateError } = await supabase
      .from("contracts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return { data: null, error: updateError };
    }

    setContracts((prev) => prev.map((c) => (c.id === id && data ? data : c)));
    return { data, error: null };
  };

  const getCurrentUserContracts = () => {
    if (!currentUser) {
      return { data: null, error: new Error("حدث خطا في جلب العقود: User ID") };
    }

    const data = contracts.filter(
      (c) =>
        c.supplier_id === currentUser.id || c.retailer_id === currentUser.id
    );

    if (!data.length) {
      return {
        data: null,
        error: new Error("حدث خطا في جلب العقود: Contracts List"),
      };
    }
    return { data, error: null };
  };

  const getContractsByUserId = (userId: string) => {
    if (!userId) {
      return { data: null, error: new Error("حدث خطا في جلب العقود: User ID") };
    }

    const data = contracts.filter(
      (c) => c.supplier_id === userId || c.retailer_id === userId
    );

    if (!data.length) {
      return {
        data: null,
        error: new Error("حدث خطا في جلب العقود: Contracts List"),
      };
    }

    return { data, error: null };
  };

  return {
    contracts,
    loading,
    error,
    fetchContracts,
    createContract,
    updateContract,
    getCurrentUserContracts,
    getContractsByUserId,
  };
}
