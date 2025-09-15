"use client";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { Composer } from "@/components/chat/Composer";
import { MessageList } from "@/components/chat/MessageList";
import { ChatSchema, Message } from "@/types/schema";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Chat() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  // Initialize conversation
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/chat/init/${sessionId}`, {
          method: "POST",
        });
        const data = await res.json();
        const parsed_chat = ChatSchema.parse(data);
        setMessages(parsed_chat?.history);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || sending) return;

    setMessages((prev) => [...prev, { role: "user", content }]);
    setSending(true);

    try {
      const res = await fetch(`/api/chat/${sessionId}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      const parsed_chat = ChatSchema.parse(data);
      setMessages(parsed_chat?.history);
    } catch (err) {
      console.error(err);
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
          <div className="rounded-2xl p-4 sm:p-6 backdrop-blur">
            <MessageList messages={messages} />
          </div>
        </div>
      </main>

      {/* Footer: fixed on mobile for easy access, normal flow on larger screens */}
      <footer className="fixed bottom-0 left-0 w-full border-t border-white/10 bg-black/80 backdrop-blur sm:static">
        <div className="mx-auto max-w-2xl px-4 py-3 sm:py-4">
          <Composer onSend={send} disabled={sending} />
        </div>
      </footer>
    </div>
  );
}
