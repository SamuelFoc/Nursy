"use client";
import { useRef, useState } from "react";

export function Composer({
  onSend,
  disabled = false,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSend() {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
    inputRef.current?.focus(); // keep typing without clicking
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm 
               text-slate-100 placeholder:text-slate-400 
               focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition"
        placeholder={disabled ? "Sending…" : "Type your message…"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={disabled}
        autoFocus
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled}
        className="relative inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3
               rounded-full border border-white text-white font-medium tracking-wide
               transition-all duration-300 ease-out
               hover:bg-white hover:text-black
               focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
               disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  );
}
