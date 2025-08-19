"use client"
import { ChatHeader } from "@/components/chat/ChatHeader";
import { Composer } from "@/components/chat/Composer";
import { MessageList } from "@/components/chat/MessageList";
import { INITIAL_MESSAGES, nextNurseReply } from "@/lib/nurseFlow";
import { Message } from "@/types/chat";
import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
    };
    const reply: Message = nextNurseReply([...messages, userMsg]);
    setMessages((prev) => [...prev, userMsg, reply]);
  }

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader title="Virtual Nurse" />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-2xl mx-auto p-4">
          <MessageList messages={messages} />
        </div>
      </main>
      <footer className="border-t bg-white">
        <div className="max-w-2xl mx-auto p-4">
          <Composer onSend={send} />
        </div>
      </footer>
    </div>
  );
}
