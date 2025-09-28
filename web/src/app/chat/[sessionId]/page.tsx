"use client";
import { Composer } from "@/components/chat/Composer";
import { MessageList } from "@/components/chat/MessageList";
import { ChatSiteLayout } from "@/components/general/layouts/ChatSiteLayout";
import Navigator from "@/components/general/Navigator";
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
  }, [sessionId]);

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
    <ChatSiteLayout>
      <div className="flex flex-col h-[94vh]">
        {/* Top navigator */}
        <div className="shrink-0">
          <Navigator />
        </div>

        {/* Scrollable messages */}
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} />
        </div>

        {/* Composer at bottom */}
        <footer className="shrink-0 border-t border-white/10 bg-black/80 backdrop-blur">
          <div className="mx-auto max-w-2xl px-4 py-3 sm:py-4">
            <Composer onSend={send} disabled={sending} />
          </div>
        </footer>
      </div>
    </ChatSiteLayout>
  );
}
