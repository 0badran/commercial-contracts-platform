import { createClient } from "@/lib/supabase/server";

export default async function updateContractStatus(
  contractId: string,
  status: Database["contract"]["status"]
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contract")
    .update({ status })
    .eq("id", contractId)
    .single();

  return { data, error };
}
