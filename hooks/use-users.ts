"use client";

import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase/client";

export function useUsers() {
  const [users, setUsers] = useState<Database["user"][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ في جلب المستخدمين"
      );
    } finally {
      setLoading(false);
    }
  };

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

  return {
    users,
    loading,
    error,
    // createUser,
    // updateUser,
    getUsersByType,
    refetch: fetchUsers,
  };
}
