import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

type Payment = Database["payment"];

export function usePayments({
  contractId,
  retailerId,
  supplierId,
}: {
  contractId?: string;
  retailerId?: string;
  supplierId?: string;
}) {
  const supabase = createClient();
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["payments", contractId, retailerId, supplierId],
    queryFn: async () => {
      if (contractId) {
        return supabase
          .from("payments")
          .select("*")
          .eq("contract_id", contractId)
          .order("created_at", { ascending: true });
      }

      if (retailerId) {
        return supabase
          .from("payments")
          .select(
            `
						*,
						contract:contracts!inner(retailer_id)
					`
          )
          .eq("contract.retailer_id", retailerId)
          .order("created_at", { ascending: true });
      }

      if (supplierId) {
        return supabase
          .from("payments")
          .select(
            `
				*,
				contract:contracts!inner(supplier_id)
			`
          )
          .eq("contract.supplier_id", supplierId)
          .order("created_at", { ascending: true });
      }

      return supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: true });
    },
  });

  const payments: Database["payment"][] = data?.data || [];

  const createPayment = async (payment: Payment) => {
    const { data, error } = await supabase
      .from("payments")
      .insert(payment)
      .select()
      .single<Payment>();

    return { data, error };
  };

  const updatePayment = async (
    id: string,
    updates: Partial<Omit<Payment, "id" | "created_at" | "updated_at">>
  ) => {
    const { data, error } = await supabase
      .from("payments")
      .update(updates)
      .eq("id", id)
      .select()
      .single<Payment>();

    return { data, error };
  };

  const deletePayment = async (id: string) => {
    const { data, error } = await supabase
      .from("payments")
      .delete()
      .eq("id", id)
      .single<Payment>();

    return { error, data };
  };

  const getPaymentById = (id: string) => {
    return payments.find((p) => p.id === id) || null;
  };

  return {
    payments,
    loading,
    error,
    refetch,
    createPayment,
    updatePayment,
    deletePayment,
    getPaymentById,
  };
}
