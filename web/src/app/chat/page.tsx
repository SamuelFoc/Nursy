"use client";
import { Composer } from "@/components/chat/Composer";
import { MessageList } from "@/components/chat/MessageList";
import { AppBar } from "@/components/landing/AppBar";
import type { ChatMessage, Role } from "@/types/chat";
import { useEffect, useState } from "react";

type ApiResponse = {
  chat_id: string;
  history: { role: Role; content: string } [];
};

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Initialize conversation
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/chat/init", { method: "POST" });
      const data = (await res.json()) as ApiResponse;

      if (!res.ok) {
        setMessages([
          {
            role: "assistant",
            content: "Conversation initialization failed.",
          },
        ]);
        return;
      }

      if (!cancelled) {
        setChatId(data.chat_id);
        setMessages(data.history.filter((m) => m.role !== "system"));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || sending || !chatId) return;

    setMessages((prev) => [...prev, { role: "user", content }]);
    setSending(true);

    try {
      const res = await fetch(`/api/chat/${encodeURIComponent(chatId)}`, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = (await res.json()) as ApiResponse;

      if (!res.ok) {
        setMessages(
          (prev) => [...prev, { role: "assistant", content: "We are sorry but the connection was lost." }]
        );
        return;
      }

      console.log('HISTORY', data.history)
      const reply = data.history.at(-1)?.content?.trim() ?? "";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${msg}` }]);
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
          <Composer onSend={send} disabled={sending || !chatId} />
        </div>
      </footer>
    </div>
  );
}
