import { HeartbeatIcon, ShieldIcon } from "@/components/general/Icons"; // your icon exports

export function SystemBadges() {
  return (
    <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-slate-400">
      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
        <ShieldIcon className="h-3.5 w-3.5" />
        Encrypted in transit
      </span>
      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
        <HeartbeatIcon className="h-3.5 w-3.5" />
        Triage-aware prioritization
      </span>
    </div>
  );
}
