"use client";
import { MinimalLogo } from "../general/MinimalLogo";

export function ChatHeader() {
  return (
    <header>
      <div className="flex items-center gap-2">
        <MinimalLogo href="/" />
      </div>
    </header>
  );
}
