"use client";

export function InfoSection() {
  return (
    <section id="privacy" className="mx-auto max-w-6xl px-4 pb-16">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-medium text-white">Security & Privacy</h3>
          <p className="mt-2 text-sm text-slate-300">
            The demo app runs locally with hardcoded logic. In production, use
            your own compliant backend (HIPAA/GDPR as applicable), store minimal
            PHI, and enforce access controls. We keep the UX simple to reduce
            user error.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-medium text-white">Clinician Workflow</h3>
          <p className="mt-2 text-sm text-slate-300">
            The virtual nurse gathers essentials so staff can prioritize cases.
            Export summaries to your EHR, or hand off to a human as needed.
          </p>
        </div>
      </div>
    </section>
  );
}
