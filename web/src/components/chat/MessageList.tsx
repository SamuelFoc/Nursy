"use client";
import { ChatMessage } from "@/types/chat";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBuble";

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [messages]);

  return (
    <div ref={ref} className="space-y-3">
      {messages.map((m, id) => (
        <MessageBubble key={id} message={m} />
      ))}
    </div>
  );
}
