"use client";
import React from "react";


export function ChatHeader({ title }: { title: string }) {
return (
<header className="p-4 bg-blue-600 text-white">
<h1 className="text-base font-semibold">{title}</h1>
</header>
);
}