import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRole = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!;

const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Access auth admin api
export const adminAuthClient = supabase.auth.admin;
