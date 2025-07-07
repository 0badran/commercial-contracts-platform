"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "../lib/supabase/client";
import useUser from "./use-user";

export function useUsers() {
  const supabase = createClient();
  const {
    data,
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () =>
      supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false }),
  });

  const users: Database["user"][] = data?.data || [];

  const { user } = useUser();

  const getUsersByType = (userType: Database["user"]["user_type"]) => {
    return users.filter((user) => user.user_type === userType);
  };

  const getUserById = (id: string) => {
    return users.find((user) => user.id === id);
  };

  const getUsersContractedWithCurrentUser = (
    contracts: Database["contract"][]
  ) => {
    const userType = (user?.user_metadata as Database["user"])?.user_type;
    if (!userType) {
      return { data: [], error: new Error("USER_TYPE") };
    }
    const usersIds = new Set(
      (contracts || []).map((c) =>
        userType === "retailer" ? c.supplier_id : c.retailer_id
      )
    );
    return { data: users.filter((u) => usersIds.has(u.id!)), error: null };
  };
  return {
    users,
    loading,
    error,
    currentUser: user,
    getUsersByType,
    refetch,
    getUsersContractedWithCurrentUser,
    getUserById,
  };
}
