"use client";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Logo small />
          <span>© {new Date().getFullYear()} Nursy</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#privacy" className="hover:text-white">
            Privacy
          </a>
          <a href="mailto:samo.sipikal@gmail.com" className="hover:text-white">
            samo.sipikal@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
