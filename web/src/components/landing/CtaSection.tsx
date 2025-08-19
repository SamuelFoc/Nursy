"use client";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-tr from-white/5 to-white/[0.02] p-6 sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Try the intake chat
            </h3>
            <p className="text-sm text-slate-300">
              Start a quick demo conversation with the virtual nurse.
            </p>
          </div>
          <Link
            href="/chat"
            className="rounded-lg bg-sky-500 px-5 py-3 font-medium text-slate-950 hover:bg-sky-400"
          >
            Open Chat
          </Link>
        </div>
      </div>
    </section>
  );
}
