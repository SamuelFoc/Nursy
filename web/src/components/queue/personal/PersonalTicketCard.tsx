type PersonalTicketCardProps = {
  seq?: number | null;
  position?: number | null;
};

export function PersonalTicketCard({ seq, position }: PersonalTicketCardProps) {
  return (
    <div className="max-w-md rounded-3xl p-px bg-gradient-to-b from-white/25 to-white/15 ">
      <div className="rounded-[calc(1.5rem-1px)] p-10 sm:p-8 bg-black/75 backdrop-blur text-center">
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
            {position < 2 ? "Stay nearby. You'll be called in order." : ""}
          </div>
        )}
      </div>
    </div>
  );
}
