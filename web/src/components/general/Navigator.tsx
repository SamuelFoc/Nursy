"use client";

import { MinimalLogo } from "./MinimalLogo";
import ToggleMenu from "./ToggleMenu";

export default function Navigator({ title }: { title?: string | null }) {
  return (
    <header className="flex flex-col justify-center gap-12">
      <div className="flex items-center justify-between gap-4">
        <MinimalLogo href="/" />
        <ToggleMenu />
      </div>
      {title && (
        <div>
          <h1 className="text-4xl sm:text-5xl 3xl:text-7xl font-semibold tracking-tight">
            {title}
          </h1>
        </div>
      )}
    </header>
  );
}
