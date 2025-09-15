"use client";
import { MinimalLogo } from "../general/MinimalLogo";

export function ChatHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <MinimalLogo href="/" />
          <span className="font-semibold tracking-tight">IQS</span>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 sm:flex">
          {/* Links here */}
        </nav>
      </div>
    </header>
  );
}
