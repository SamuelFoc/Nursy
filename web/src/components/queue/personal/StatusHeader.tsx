type StatusHeaderProps = { sessionId: string | number };

export function StatusHeader({ sessionId }: StatusHeaderProps) {
  return (
    <>
      <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
        Your Status
      </h1>
      <p className="mt-2 text-slate-300 text-xs sm:text-base">
        Session ID:{" "}
        <span className="font-mono break-all">{String(sessionId)}</span>
      </p>
    </>
  );
}
