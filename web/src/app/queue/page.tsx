"use client";

import RedirectButton from "@/components/buttons/RedirectButton";
import { PublicTicketCard } from "@/components/queue/PublicTicketCard";
import { type PublicQueue, PublicQueueSchema } from "@/types/schema";
import { useEffect, useState } from "react";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export default function QueuePage() {
  const [queue, setQueue] = useState<PublicQueue | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/queue`, { method: "GET" });
        const data = await res.json();
        const parsed = PublicQueueSchema.parse(data);
        setQueue(parsed);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    // Prefer cookie; fallback to sessionStorage
    let id = getCookie("iqs_session_id");
    if (!id && typeof window !== "undefined") {
      id = window.sessionStorage.getItem("iqs_session_id");
    }
    if (id) setSessionId(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="relative mx-auto px-4 lg:px-20 py-20 sm:py-28">
        <div className="w-full">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-4xl sm:text-5xl 3xl:text-7xl font-semibold tracking-tight">
              Queue
            </h1>

            {sessionId && (
              <div>
                <RedirectButton href={`/queue/${sessionId}`}>
                  Home
                </RedirectButton>
              </div>
            )}
          </div>

          <div className="w-full mt-16 sm:mt-20 grid grid-cols-4 gap-6 sm:gap-8 sm:grid-cols-6 lg:grid-cols-6">
            {queue?.queue?.map((item, id) => (
              <PublicTicketCard key={id} seq={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
