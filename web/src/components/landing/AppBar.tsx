"use client";
import { Logo } from "./Logo";

export function AppBar({
  variant = "landing",
}: {
  variant?: "landing" | "chat";
}) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo href="/" />
          <span className="font-semibold tracking-tight">IQS</span>
        </div>
        {variant === "landing" ? (
          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-300">
            {/* Here comes the links */}
          </nav>
        ) : (
          <div />
        )}
      </div>
    </header>
  );
}
