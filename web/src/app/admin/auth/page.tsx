"use client";

import { AuthButton } from "@/components/admin/auth/AuthButton";
import { AuthLayout } from "@/components/admin/auth/AuthLayout";
import { InputField } from "@/components/admin/auth/InputField";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const msg = (await res.json()).detail || "Login failed";
        throw new Error(msg);
      }

      const data = await res.json();
      localStorage.setItem("jwt", data.access_token);

      router.replace("/admin"); // redirect after successful login
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="IQS">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        <InputField
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <AuthButton type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
