import { createClient } from "@/lib/supabase/server";

export default async function getContracts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false });
  const contracts = data as Database["contract"][];

  return { contracts, error };
}
