"use client";
import React, { useState } from "react";
import { MessageList } from "../../components/chat/MessageList";
import { Composer } from "../../components/chat/Composer";
import { nextNurseReply, INITIAL_MESSAGES } from "../../lib/nurseFlow";
import { Message } from "@/types/chat";
import { AppBar } from "@/components/landing/AppBar";

export default function ChatPage() {
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
    <div className="flex flex-col min-h-dvh bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <AppBar variant={"chat"} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <MessageList messages={messages} />
          </div>
        </div>
      </main>
      <footer className="border-t border-white/10 bg-white/5">
        <div className="max-w-2xl mx-auto p-4">
          <Composer onSend={send} />
        </div>
      </footer>
    </div>
  );
}
