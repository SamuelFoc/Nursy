"use client";
import { Composer } from "@/components/chat/Composer";
import { MessageList } from "@/components/chat/MessageList";
import { ChatSiteLayout } from "@/components/general/layouts/ChatSiteLayout";
import Section from "@/components/general/layouts/Section";
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
    <ChatSiteLayout>
      <Navigator />
      <Section>
        <MessageList messages={messages} />
      </Section>

      {/* Footer: fixed on mobile for easy access, normal flow on larger screens */}
      <footer className="fixed bottom-0 left-0 w-full border-t border-white/10 bg-black/80 backdrop-blur sm:static">
        <div className="mx-auto max-w-2xl px-4 py-3 sm:py-4">
          <Composer onSend={send} disabled={sending} />
        </div>
      </footer>
    </ChatSiteLayout>
  );
}
