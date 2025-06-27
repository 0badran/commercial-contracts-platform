"use client";

import { ERROR_TYPES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { crazyToast } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import useUser from "./use-user";

type Contract = Database["contract"];

export function useContracts() {
  const supabase = createClient();

  const {
    data,
    error,
    refetch,
    isLoading: loading,
  } = useQuery({
    queryKey: ["contracts"],
    queryFn: async () =>
      await supabase
        .from("contracts")
        .select("*")
        .order("created_at", { ascending: false }),
  });

  const contracts: Database["contract"][] = data?.data || [];

  const { user, loading: userLoading } = useUser();

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
    refetch();
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
    refetch();
    return { data, error: null };
  };

  const deleteContract = async (id: string) => {
    const { error } = await supabase.from("contracts").delete().eq("id", id);
    if (error) {
      return crazyToast("حدث خطأ أثناء حذف العقد", "error");
    }
    refetch();
    crazyToast("تم حذف العقد", "success");
    return {
      data: null,
      error: null,
    };
  };

  const getCurrentUserContracts = () => {
    if (userLoading) {
      console.log("User Fetching...");
      return { data: [], error: null };
    }
    if (!user) {
      console.error(ERROR_TYPES.USER_MISSING);
      return { data: [], error: new Error("حدث خطا في جلب العقود") };
    }
    if (error) {
      console.error(ERROR_TYPES.CONTRACTS_FETCH_ERROR, error);
      return { data: [], error: new Error("حدث خطا في جلب العقود") };
    }
    const data = contracts.filter(
      (c) => c.supplier_id === user.id || c.retailer_id === user.id
    );
    return { data, error: null };
  };

  const getContractsByUserId = (userId: string) => {
    if (!userId) {
      return { data: [], error: new Error("حدث خطا في جلب العقود: User ID") };
    }

    const data = contracts.filter(
      (c) => c.supplier_id === userId || c.retailer_id === userId
    );

    if (!data.length) {
      return {
        data: [],
        error: new Error("حدث خطا في جلب العقود: Contracts List"),
      };
    }

    return { data, error: null };
  };

  const getContractById = (id: string) => {
    return contracts.find((c) => c.id === id) || null;
  };
  return {
    contracts,
    loading,
    error,
    refetch,
    createContract,
    updateContract,
    deleteContract,
    getCurrentUserContracts,
    getContractsByUserId,
    getContractById,
  };
}
