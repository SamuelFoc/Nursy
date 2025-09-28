"use client";
import { Message } from "@/types/schema";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBuble";

export function MessageList({ messages }: { messages: Message[] }) {
  const ref = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={ref} className="h-full overflow-y-auto px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-3">
        {messages.map((m, id) => (
          <MessageBubble key={id} message={m} />
        ))}
      </div>
    </div>
  );
}
