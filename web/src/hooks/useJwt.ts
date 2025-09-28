"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useJWT() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.replace("/admin/auth");
    } else {
      setToken(jwt);
    }
  }, []);

  const clearToken = () => {
    localStorage.removeItem("jwt");
    setToken(null);
    router.replace("/admin/auth");
  };

  return { token, clearToken };
}
