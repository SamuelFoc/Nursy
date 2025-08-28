"use client";
import { type PublicQueue, PublicQueueSchema } from "@/types/schema";
import { useEffect, useState } from "react";

export default function QueuePage() {
  const [queue, setQueue] = useState<PublicQueue | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/queue`, {
          method: "GET",
        });
        const data = await res.json();
        const queue = PublicQueueSchema.parse(data);
        setQueue(queue);
      } catch (err) {
        console.error(err)
      }
    })();
  }, []);

  return (
    <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
            <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
                Queue
            </h1>

            <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {queue?.queue?.map((item, id) => (
                <div
                    key={id}
                    aria-live="polite"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur"
                >
                    <div className="text-7xl sm:text-8xl font-bold leading-none tracking-tight text-white">
                    {item ?? "—"}
                    </div>
                    {id < 2 && (
                    <div className="mt-3 text-xs text-slate-400">
                        Stay nearby. You’ll be called in order.
                    </div>
                    )}
                </div>
                ))}
            </div>
            </div>
        </div>
    </section>
  );
}
