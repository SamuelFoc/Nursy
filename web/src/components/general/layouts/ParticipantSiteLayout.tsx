"use client";

import { ReactNode } from "react";
import { MinimalFooter } from "../MinimalFooter";

type SiteLayoutProps = {
  children: ReactNode;
  footer?: boolean;
};

export function ParticipantSiteLayout({
  children,
  footer = true,
}: SiteLayoutProps) {
  return (
    <section className="min-h-screen flex flex-col px-8 py-8 bg-black text-white antialiased font-sans">
      {/* Main content grows and pushes footer down */}
      <main className="flex-grow flex flex-col">{children}</main>

      {footer && <MinimalFooter />}
    </section>
  );
}
