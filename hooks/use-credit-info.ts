"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import useUser from "./use-user";

type CreditInfo = Database["credit_info"];

export function useCreditInfo() {
  const supabase = createClient();
  const {
    data: retailerRate,
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
  const { user } = useUser();

  const creditInfo: CreditInfo[] = retailerRate?.data || [];

  const getCreditById = (id: string) => {
    if (!creditInfo || !user) {
      return null;
    }

    return (
      creditInfo.find(
        (credit) => credit.retailer_id === id && credit.supplier_id === user.id
      ) || null
    );
  };

  const getCreditByIdForAdmin = (id: string) => {
    if (!creditInfo || !user) {
      return null;
    }

    const retailerRate = creditInfo.filter(
      (credit) => credit.retailer_id === id
    );
    if (!retailerRate.length) {
      return null;
    }
    const count = retailerRate.length;

    const numericKeys = [
      "active_contracts",
      "total_commitments",
      "paid_amount",
      "overdue_amount",
      "payment_score",
      "average_delay",
      "contract_success_rate",
    ];

    const result: CreditInfo = {};

    for (const key of numericKeys) {
      const values = retailerRate.map((d) => d[key] ?? 0);
      const sum = values.reduce((a, b) => a + b, 0);
      result[key] = parseFloat((sum / count).toFixed(2));
    }

    // أحدث تاريخ دفع
    result.last_payment_date = retailerRate
      .map((d) => d.last_payment_date)
      .filter(Boolean)
      .sort()
      .reverse()[0];

    // أكثر تصنيف تكرارًا في credit_rating
    const ratingFreq: Record<string, number> = {};
    retailerRate.forEach((d) => {
      const r = d.credit_rating ?? "C";
      ratingFreq[r] = (ratingFreq[r] || 0) + 1;
    });
    result.credit_rating = Object.entries(ratingFreq).sort(
      (a, b) => b[1] - a[1]
    )[0][0] as CreditInfo["credit_rating"];

    // أكثر مستوى مخاطرة تكرارًا
    const riskFreq: Record<string, number> = {};
    retailerRate.forEach((d) => {
      const r = d.risk_level ?? "medium";
      riskFreq[r] = (riskFreq[r] || 0) + 1;
    });
    result.risk_level = Object.entries(riskFreq).sort(
      (a, b) => b[1] - a[1]
    )[0][0] as CreditInfo["risk_level"];

    // دمج التاريخ الشهري
    const monthlyMap = new Map<
      string,
      { due: number; paid: number; count: number; onTime: number }
    >();

    retailerRate.forEach((d) => {
      d.monthly_history?.forEach((m) => {
        if (!monthlyMap.has(m.month)) {
          monthlyMap.set(m.month, { due: 0, paid: 0, count: 0, onTime: 0 });
        }
        const entry = monthlyMap.get(m.month)!;
        entry.due += m.due;
        entry.paid += m.paid;
        entry.count += 1;
        entry.onTime += m.onTime ? 1 : 0;
      });
    });

    result.monthly_history = Array.from(monthlyMap.entries()).map(
      ([month, { due, paid, count, onTime }]) => ({
        month,
        due: parseFloat((due / count).toFixed(2)),
        paid: parseFloat((paid / count).toFixed(2)),
        onTime: onTime / count > 0.5,
      })
    );

    return result;
  };

  return {
    creditInfo,
    loading,
    error,
    refetch,
    getCreditById,
    getCreditByIdForAdmin,
  };
}
