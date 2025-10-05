"use client";

import { useState } from "react";

type Props = {
  sessionId: string;
};

export default function ParticipantAdminComunicator({ sessionId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `/api/admin/call_participant/${encodeURIComponent(sessionId)}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Request failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("Call success:", data);
      // TODO: handle participant response (maybe update UI?)
    } catch (err: any) {
      console.error("Call error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <div
        className="py-2 px-4 border border-green-400 rounded-md cursor-pointer"
        onClick={handleClick}
      >
        {loading ? "Calling..." : "Call In"}
      </div>
      <div className="py-2 px-4 border border-yellow-400 rounded-md cursor-pointer">
        Resolve
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
