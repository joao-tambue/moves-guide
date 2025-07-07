import { useEffect, useState } from "react";
import { api } from "../services/api";

export type User = {
  id: string;
  name: string;
  email: string;
};

export function useFetchUser(token: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const response = await api.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuário logado:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [token]);

  return { user, loading };
}
