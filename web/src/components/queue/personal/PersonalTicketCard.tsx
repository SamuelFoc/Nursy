type PersonalTicketCardProps = {
  seq?: number | null;
  position?: number | null;
};

export function PersonalTicketCard({ seq, position }: PersonalTicketCardProps) {
  return (
    <div
      aria-live="polite"
      className="flex justify-center items-center mx-auto w-full sm:max-w-sm h-55 sm:max-h-sm rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 text-center backdrop-blur"
    >
      <div>
        <div className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-400">
          Your Number
        </div>
        <div className="mt-4 text-6xl sm:text-8xl font-bold leading-none tracking-tight">
          {seq ?? "—"}
        </div>
      </div>
      {position && (
        <div className="mt-3 text-xs text-slate-400">
          {position < 2 ? "Stay nearby. You’ll be called in order." : ""}
        </div>
      )}
    </div>
  );
}
