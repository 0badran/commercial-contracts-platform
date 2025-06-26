"use client";

import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase/client";
import useUser from "./use-user";

export function useUsers() {
  const [users, setUsers] = useState<Database["user"][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return setError("حدث خطأ في جلب المستخدمين");
    }
    setUsers(data || []);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const { user } = useUser();

  // const createUser = async (user: UserInsert) => {
  //   try {
  //     const { data, error } = await supabase.from("users").insert(user).select().single()

  //     if (error) throw error

  //     setUsers((prev) => [data, ...prev])
  //     return data
  //   } catch (err) {
  //     throw new Error(err instanceof Error ? err.message : "حدث خطأ في إنشاء المستخدم")
  //   }
  // }

  // const updateUser = async (id: string, updates: UserUpdate) => {
  //   try {
  //     const { data, error } = await supabase.from("users").update(updates).eq("id", id).select().single()

  //     if (error) throw error

  //     setUsers((prev) => prev.map((user) => (user.id === id ? data : user)))
  //     return data
  //   } catch (err) {
  //     throw new Error(err instanceof Error ? err.message : "حدث خطأ في تحديث المستخدم")
  //   }
  // }

  const getUsersByType = (userType: Database["user"]["user_type"]) => {
    return users.filter((user) => user.user_type === userType);
  };

  const getUserById = (id: string) => {
    return users.find((user) => user.id === id);
  };

  const getUsersContractedWithCurrentUser = (
    contracts: Database["contract"][]
  ) => {
    const userType = (user?.user_metadata as Database["user"]).user_type;
    const usersIds = new Set(
      contracts.map((c) =>
        userType === "retailer" ? c.retailer_id : c.supplier_id
      )
    );
    return users.filter((u) => usersIds.has(u.id!));
  };
  return {
    users,
    loading,
    error,
    // createUser,
    // updateUser,
    currentUser: user,
    getUsersByType,
    refetch: fetchUsers,
    getUsersContractedWithCurrentUser,
    getUserById,
  };
}
