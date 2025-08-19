"use client";
import Link from "next/link";
import { HeartbeatIcon, ShieldIcon } from "../custom/Icons";


export function Hero() {
  return (
    <section className="relative overflow-hidden">
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
            AI triage for modern healthcare
          </h1>
          <p className="mt-4 text-slate-300">
            A minimal, secure intake assistant that collects basic patient
            information before a nurse steps in—fast, consistent, and
            privacy-first.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-5 py-3 font-medium text-slate-950 shadow-sm hover:bg-sky-400"
            >
              Start Chat
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 px-5 py-3 font-medium text-white/90 hover:bg-white/5"
            >
              How it works
            </a>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <ShieldIcon className="h-4 w-4" />
              Encrypted in transit
            </div>
            <div className="flex items-center gap-1">
              <HeartbeatIcon className="h-4 w-4" />
              Built for clinical triage
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
