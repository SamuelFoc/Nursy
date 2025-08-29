"use client";
import { JoinQueueButton } from "@/components/landing/JoinQueueButton";
import { HeartbeatIcon, ShieldIcon } from "../general/Icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.white/5)_1px,transparent_1px)] [background-size:24px_24px]"
      />
      <div
        aria-hidden
        className="absolute -top-24 right-1/2 translate-x-1/3 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
            Intelligent Queueing System
          </h1>

          <p className="mt-2 text-slate-300">
            Register, get a number, consult your problem and watch your live
            position.
          </p>

          <div className="mt-16 flex flex-wrap items-center gap-3">
            {/* Primary action: register and redirect to live status */}
            <JoinQueueButton />
          </div>

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

          {/* Terse disclosure; set expectations */}
          <p className="mt-2 text-xs text-slate-500">
            Note: Critical cases may be prioritized ahead of you based on
            clinical triage.
          </p>
        </div>
      </div>
    </section>
  );
}
