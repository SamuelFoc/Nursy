"use client";
import React, { useState } from "react";

export function Composer({
  onSend,
  disabled = false,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  function handleSend() {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  }

  return (
    <div className="flex gap-2">
      <input
        className="flex-1 border border-white/10 bg-transparent rounded px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400"
        placeholder={disabled ? "Sending…" : "Type your message…"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className="px-4 py-2 rounded text-sm bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
}
