"use client";
import { HeartbeatIcon, ShieldIcon } from "@/components/custom/Icons";
import { ParticipantSchema, type Participant } from "@/types/schema";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function QueuePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [participant, setParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      try {
        const res = await fetch(`/api/queue/register/${sessionId}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
        });
        const data = await res.json();
        const participant = ParticipantSchema.parse(data);
        console.log(participant)
        setParticipant(participant);
      } catch (err) {
        console.error(err)
      }
    })();
  }, [sessionId]);

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
            Your Status
          </h1>

          <p className="mt-2 text-slate-300">
            Session ID: <span className="font-mono">{String(sessionId)}</span>
          </p>

          {/* Big, waiting-room style number */}
          <div className="mt-20">
            <div
              aria-live="polite"
              className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur"
            >
              <div className="text-sm uppercase tracking-wider text-slate-400">
                Your Number
              </div>
              <div className="mt-3 text-7xl sm:text-8xl font-bold leading-none tracking-tight text-white">
                {participant?.seq ?? "—"}
              </div>
              <div className="mt-3 text-xs text-slate-400">
                {participant?.seq != null
                  ? "Stay nearby. You’ll be called in order."
                  : "Registered. Waiting for initial position…"}
              </div>
            </div>
          </div>
          
          {/* CTA to external/next step */}
          <div className="mt-20 flex flex-wrap items-center gap-3">
            <Link
              href={"/chat"}
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-6 py-4 text-lg font-semibold text-slate-950 shadow-md hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900"
            >
              Go to Consultation
            </Link>
          </div>

          {/* Optional metadata */}
          {participant?.agent_id && (
            <p className="mt-4 text-slate-400 text-sm">
              Handling agent: <span className="font-mono">{participant.agent_id}</span>
            </p>
          )}

          {/* System badges */}
          <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <ShieldIcon className="h-4 w-4" />
              Encrypted in transit
            </div>
            <div className="flex items-center gap-1">
              <HeartbeatIcon className="h-4 w-4" />
              Triage-aware prioritization
            </div>
          </div>

          {/* Minimal chat history (optional, keeps UI clean) */}
          {participant?.chat?.history?.length ? (
            <div className="mt-8 text-left rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <h2 className="text-sm font-semibold text-slate-200 mb-2">Chat</h2>
              <ul className="space-y-2 text-sm text-slate-300 max-h-64 overflow-y-auto">
                {participant.chat.history.map((msg, i) => (
                  <li key={i}>
                    <span className="font-semibold">{msg.role}:</span> {msg.content}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Disclaimer */}
          <p className="mt-6 text-slate-500 text-xs">
            Critical cases may be prioritized ahead based on clinical triage.
          </p>
        </div>
      </div>
    </section>
  );
}
