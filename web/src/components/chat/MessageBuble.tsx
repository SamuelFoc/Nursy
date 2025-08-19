"use client";
import { Message } from "@/types/chat";
import React from "react";

export function MessageBubble({ message }: { message: Message }) {
  const isAssistant = message.role === "assistant";
  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={
          `max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ` +
          (isAssistant
            ? "bg-white/5 border border-white/10 text-slate-100"
            : "bg-sky-500/10 border border-white/10 text-slate-100")
        }
      >
        {message.content}
      </div>
    </div>
  );
}
