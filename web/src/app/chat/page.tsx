"use client";
import { Composer } from "@/components/chat/Composer";
import { MessageList } from "@/components/chat/MessageList";
import { AppBar } from "@/components/landing/AppBar";
import type { ChatMessage, Role } from "@/types/chat";
import { useEffect, useRef, useState } from "react";

type InitResponse = {
  chat_id: string;
  history: { role: Role; content: string }[];
  error?: string;
  detail?: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // track if we're currently streaming an assistant reply
  const streamingAssistantRef = useRef(false);

  // Initialize conversation
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/chat/init", { method: "POST" });
      const data = (await res.json()) as InitResponse;
      if (!res.ok || data.error) {
        setMessages([
          {
            role: "assistant",
            content: `Init failed: ${data.error ?? res.status} ${data.detail ?? ""}`,
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

  function appendAssistantChunk(chunk: string) {
    if (!chunk || chunk === "[START]" || chunk === "[DONE]") return;

    setMessages((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];

      if (!streamingAssistantRef.current || !last || last.role !== "assistant") {
        // start a new assistant message
        next.push({ role: "assistant", content: chunk });
        streamingAssistantRef.current = true;
        return next;
      }

      // append to existing assistant message
      next[next.length - 1] = { role: "assistant", content: last.content + chunk };
      return next;
    });
  }

  function finalizeAssistantMessage() {
    streamingAssistantRef.current = false;
  }

  async function send(text: string) {
    if (!text.trim() || sending || !chatId) return;

    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const res = await fetch(`/api/chat/${encodeURIComponent(chatId)}/stream`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "text/event-stream",
        },
        body: JSON.stringify({ content: userMsg.content }),
      });

      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        appendAssistantChunk(`Error contacting chat API: ${res.status} ${detail}`);
        finalizeAssistantMessage();
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE frames (handle \n\n or \r\n\r\n)
        let idx: number;
        // prefer \r\n\r\n split; if not found, fall back to \n\n
        while (
          (idx = buffer.indexOf("\r\n\r\n")) !== -1 ||
          (idx = buffer.indexOf("\n\n")) !== -1
        ) {
          const frame = buffer.slice(0, idx);
          buffer = buffer.slice(idx + (buffer[idx] === "\r" ? 4 : 2));

          const lines = frame.split(/\r?\n/);
          let event: string | null = null;
          const dataParts: string[] = [];
          for (const line of lines) {
            if (line.startsWith("event:")) event = line.slice(6).trim();
            else if (line.startsWith("data:")) dataParts.push(line.slice(5));
          }
          const data = dataParts.join("\n");

          if (event === "error") {
            appendAssistantChunk(`\n[Error: ${data}]`);
            continue;
          }
          if (event === "done" || data === "[DONE]") {
            finalizeAssistantMessage();
            continue;
          }
          if (data) appendAssistantChunk(data);
        }
      }

      // flush any tail
      const tail = decoder.decode();
      if (tail) buffer += tail;

      if (buffer.trim()) {
        // handle partial frame (no terminating \n\n)
        const lines = buffer.split(/\r?\n/);
        for (const line of lines) {
          const m = /^data:\s?(.*)$/.exec(line);
          if (m) appendAssistantChunk(m[1]);
        }
      }
      finalizeAssistantMessage();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      appendAssistantChunk(`Error: ${msg}`);
      finalizeAssistantMessage();
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