"use client";

import { ReactNode } from "react";

type SiteLayoutProps = {
  children: ReactNode;
  footer?: boolean;
};

export function ChatSiteLayout({ children }: SiteLayoutProps) {
  return (
    <section className="min-h-screen flex flex-col px-8 py-8 bg-black text-white antialiased font-sans">
      {/* Main content grows and pushes footer down */}
      <main className="flex-grow flex flex-col">{children}</main>
    </section>
  );
}
