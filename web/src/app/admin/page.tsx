"use client";

import { AuthButton } from "@/components/admin/auth/AuthButton";
import { AuthLayout } from "@/components/admin/auth/AuthLayout";
import { ParticipantRow } from "@/components/admin/home/ParticipantRow";
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
    <div className="flex min-h-dvh flex-col bg-black text-white antialiased">
      {/* Header */}
      <header className="flex items-center justify-between px-12 py-4 border-b border-neutral-800">
        <h1 className="text-lg font-semibold tracking-tight">
          Admin Dashboard
        </h1>
        <AuthButton
          type="button"
          onClick={() => {
            localStorage.removeItem("jwt");
            router.replace("/admin/auth");
          }}
        >
          Logout
        </AuthButton>
      </header>

      {/* Main Content */}
      <main className="flex flex-col gap-8 max-w-3xl w-full mx-auto p-6">
        <div className="overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm divide-y divide-neutral-800">
          {data?.participants
            .sort((a, b) => a.seq - b.seq)
            .map((p) => (
              <ParticipantRow key={p.session_id} participant={p} />
            ))}
        </div>
      </main>
    </div>
  );
}
