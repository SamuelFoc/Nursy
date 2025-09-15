type PublicTicketCardProps = {
  seq?: number | null;
};

export function PublicTicketCard({ seq }: PublicTicketCardProps) {
  return (
    <div
      aria-live="polite"
      className="flex justify-center items-center mx-auto 
                 w-20 h-20
                 sm:w-full sm:h-60 sm:max-w-md
                 rounded-2xl border border-white/10 bg-white/5 
                 p-1 sm:p-8 text-center backdrop-blur"
    >
      <div className="text-4xl sm:text-8xl font-bold leading-none tracking-tight">
        {seq ?? "—"}
      </div>
    </div>
  );
}
