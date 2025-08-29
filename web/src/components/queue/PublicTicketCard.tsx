type PublicTicketCardProps = {
  seq?: number | null;
};

export function PublicTicketCard({ seq }: PublicTicketCardProps) {
  return (
    <div
      aria-live="polite"
      className="flex justify-center items-center mx-auto w-full max-w-60 sm:max-w-sm h-80 max-h-50 sm:max-h-sm rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 text-center backdrop-blur"
    >
      <div className="text-6xl sm:text-8xl font-bold leading-none tracking-tight">
        {seq ?? "—"}
      </div>
    </div>
  );
}
