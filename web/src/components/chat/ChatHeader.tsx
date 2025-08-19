"use client";
import React from "react";
import { Logo } from "../landing/Logo";

export function ChatHeader() {
return (
<header className="sticky top-0 z-10 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
<div className="mx-auto max-w-3xl px-4 h-12 flex items-center">
<Logo href="/" ariaLabel="Go to landing page" />
</div>
</header>
);
}
