"use client";

import { MinimalLogo } from "@/components/general/MinimalLogo";
import AdminToggleMenu from "./AdminToggleMenu";

export default function AdminNavigator({ title }: { title?: string | null }) {
  return (
    <header className="flex flex-col justify-center gap-12">
      <div className="flex items-center justify-between gap-4">
        <MinimalLogo href="/" />
        <h1 className="font-bold text-xl">{title}</h1>
        <AdminToggleMenu />
      </div>
    </header>
  );
}
