"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

const useUser = () => {
  const supabase = createClient();
  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => supabase.auth.getUser(),
  });

  return { user: data?.data.user, loading, error };
};

export default useUser;
