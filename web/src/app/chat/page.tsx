"use client";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { Composer } from "@/components/chat/Composer";
import { MessageList } from "@/components/chat/MessageList";
import { useState } from "react";

type ApiResponse = {
  chat_id: string;
  history: { role: Role; content: string }[];
};

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Initialize conversation
  // useEffect(() => {
  //   let cancelled = false;
  //   (async () => {
  //     const res = await fetch("/api/chat/init", { method: "POST" });
  //     const data = (await res.json()) as ApiResponse;

  //     if (!res.ok) {
  //       setMessages([
  //         {
  //           role: "assistant",
  //           content: "Conversation initialization failed.",
  //         },
  //       ]);
  //       return;
  //     }

  //     if (!cancelled) {
  //       setChatId(data.chat_id);
  //       setMessages(data.history.filter((m) => m.role !== "system"));
  //     }
  //   })();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || sending || !chatId) return;

    setMessages((prev) => [...prev, { role: "user", content }]);
    setSending(true);

    try {
      const res = await fetch(`/api/chat/${encodeURIComponent(chatId)}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ content }),
      });
      const data = (await res.json()) as ApiResponse;

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "We are sorry but the connection was lost.",
          },
        ]);
        return;
      }

      console.log("HISTORY", data.history);
      const reply = data.history.at(-1)?.content?.trim() ?? "";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${msg}` },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-black text-white antialiased">
      <ChatHeader />

      {/* Main content; add bottom padding so the mobile-fixed footer doesn't overlap */}
      <main className="flex-1 overflow-y-auto pb-28 sm:pb-0">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur">
            <MessageList messages={messages} />
          </div>
        </div>
      </main>

      {/* Footer: fixed on mobile for easy access, normal flow on larger screens */}
      <footer className="fixed bottom-0 left-0 w-full border-t border-white/10 bg-black/80 backdrop-blur sm:static">
        <div className="mx-auto max-w-2xl px-4 py-3 sm:py-4">
          <Composer onSend={send} disabled={sending || !chatId} />
        </div>
      </footer>
    </div>
  );
}
