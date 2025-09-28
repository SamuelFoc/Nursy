"use client";
import { useEffect, useState } from "react";
import { useJWT } from "./useJwt";

export function useAdminData() {
  const { token, clearToken } = useJWT();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          clearToken();
          return;
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
        clearToken();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return { data, loading };
}
