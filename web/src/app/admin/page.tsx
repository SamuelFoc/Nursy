"use client";

import { AuthButton } from "@/components/admin/auth/AuthButton";
import { AuthLayout } from "@/components/admin/auth/AuthLayout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      router.replace("/admin/auth");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          localStorage.removeItem("jwt");
          router.replace("/admin/auth");
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
        router.replace("/admin/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <AuthLayout title="IQS">
        <p className="text-center text-gray-400">Loading...</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="IQS">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">
          Admin Dashboard
        </h1>
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-lg">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
        <AuthButton
          type="button"
          onClick={() => {
            localStorage.removeItem("jwt");
            router.replace("/admin/auth");
          }}
        >
          Logout
        </AuthButton>
      </div>
    </AuthLayout>
  );
}
