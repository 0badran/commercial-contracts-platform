"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "../lib/supabase/client";

type Payment = Database["payment"];

export function usePayments(props?: { contractId?: string; userId?: string }) {
  const { contractId, userId } = props || {};
  const supabase = createClient();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    let query = supabase.from("payments").select("*");

    if (contractId) {
      query = query.eq("contract_id", contractId);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    setLoading(true);
    const { data, error } = await query.order("due_date", {
      ascending: true,
    });
    setLoading(false);

    setPayments(data || []);
    setError(error ? error.message : null);
  }, [contractId, supabase, userId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const createPayment = async (payment: Payment) => {
    const { data, error } = await supabase
      .from("payments")
      .insert(payment)
      .select()
      .single<Payment>();

    if (error) {
      return setError(error.message);
    }
    setPayments((prev) => [...prev, data]);
    return data;
  };

  const updatePayment = async (id: string, updates: Payment) => {
    const { data, error } = await supabase
      .from("payments")
      .update(updates)
      .eq("id", id)
      .select()
      .single<Payment>();

    if (error) {
      setError(error.message);
      return;
    }

    setPayments((prev) =>
      prev.map((payment) => (payment.id === id ? data : payment))
    );
    return data;
  };

  return {
    payments,
    loading,
    error,
    createPayment,
    updatePayment,
    refetch: fetchPayments,
  };
}
