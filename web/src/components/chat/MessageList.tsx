"use client";
import { Message } from "@/types/schema";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBuble";

export function MessageList({ messages }: { messages: Message[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto pb-28 sm:pb-0">
      <div className="mx-auto max-w-2xl py-8">
        <div className="rounded-2xl sm:p-6 backdrop-blur">
          <div ref={ref} className="space-y-3">
            {messages.map((m, id) => (
              <MessageBubble key={id} message={m} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
