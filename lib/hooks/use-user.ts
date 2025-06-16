"use client";

import { useState, useEffect } from "react";
import { createClient } from "../supabase/client";
import { AuthError, User } from "@supabase/supabase-js";
import { getUser } from "@/app/actions";

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  const supabase = createClient();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { user, error } = await getUser();
      setLoading(false);

      setError(error);
      setUser(user);
    })();
  }, [supabase]);

  return { user, loading, error };
};

export default useUser;
