"use client";
import React, { useState } from "react";

export function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("");

  function handleSend() {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  }

  return (
    <div className="flex items-start gap-2">
      <textarea
        className="flex-1 min-h-[44px] max-h-40 resize-y rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 outline-none"
        placeholder="Type your message…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <button
        onClick={handleSend}
        className="shrink-0 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400"
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
}
