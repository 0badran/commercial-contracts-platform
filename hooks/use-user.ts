"use client";

import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase/client";
import { AuthError, User } from "@supabase/supabase-js";

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  const supabase = createClient();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      setLoading(false);

      setError(error);
      setUser(user);
    })();
  }, [supabase]);

  return { user, loading, error };
};

export default useUser;
