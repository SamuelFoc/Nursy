"use client";
import { Message } from "@/types/chat";
import React, { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBuble";

export function MessageList({ messages }: { messages: Message[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [messages]);

  return (
    <div ref={ref} className="space-y-3">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
    </div>
  );
}
