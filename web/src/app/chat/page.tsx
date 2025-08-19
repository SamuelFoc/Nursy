"use client";
import React, { useState } from "react";
import { MessageList } from "../../components/chat/MessageList";
import { Composer } from "../../components/chat/Composer";
import { INITIAL_MESSAGES } from "../../lib/nurseFlow";
import { Message } from "@/types/chat";
import { AppBar } from "@/components/landing/AppBar";

type ChatApiResponse = { message?: string; error?: string; detail?: string };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [sending, setSending] = useState(false);

  async function send(text: string) {
    if (!text.trim() || sending) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      const textBody = await res.text();
      let data: ChatApiResponse;
      try {
        data = JSON.parse(textBody) as ChatApiResponse;
      } catch {
        data = { message: textBody };
      }

      if (!res.ok) {
        const msg = data.error ?? `Request failed with ${res.status}`;
        throw new Error(data.detail ? `${msg}: ${data.detail}` : msg);
      }

      const assistantText = data.message ?? "(No reply)";
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: assistantText },
      ]);
    } catch (e: unknown) {
      const errMessage = e instanceof Error ? e.message : String(e);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Error contacting chat API: ${errMessage}`,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <AppBar variant="chat" />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <MessageList messages={messages} />
          </div>
        </div>
      </main>
      <footer className="border-t border-white/10 bg-white/5">
        <div className="max-w-2xl mx-auto p-4">
          <Composer onSend={send} disabled={sending} />
        </div>
      </footer>
    </div>
  );
}