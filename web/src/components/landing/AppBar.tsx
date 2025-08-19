"use client";
import Link from "next/link";
import { Logo } from "./Logo";

export function AppBar() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold tracking-tight">Nursy</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-300">
          <a href="#features" className="hover:text-white">
            Features
          </a>
          <a href="#privacy" className="hover:text-white">
            Privacy
          </a>
          <a href="#contact" className="hover:text-white">
            Contact
          </a>
          <Link
            href="/chat"
            className="rounded-md bg-sky-500 px-3 py-1.5 font-bold text-slate-950 hover:bg-sky-400"
          >
            Start Chat
          </Link>
        </nav>
      </div>
    </header>
  );
}
