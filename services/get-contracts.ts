import { createClient } from "@/lib/supabase/server";
import getUser from "./get-user";

export default async function getContracts() {
  const supabase = await createClient();
  const { user } = await getUser();
  const userType = user?.user_metadata.user_type;
  const { data: temp, error } = await supabase
    .from("contracts")
    .select("*")
    .eq(`${userType}_id`, user?.id)
    .order("created_at", { ascending: false });
  const data = temp as Database["contract"][];
  return { data, error };
}
