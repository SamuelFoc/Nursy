// app/api/chat/route.ts
import { NextResponse } from "next/server";

type Role = "user" | "assistant" | "system";
type ChatMessage = { role: Role; content: string };
type ChatRequestBody = { messages: ChatMessage[] };

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function isRole(x: unknown): x is Role {
  return x === "user" || x === "assistant" || x === "system";
}

function isChatMessage(x: unknown): x is ChatMessage {
  return (
    isObject(x) &&
    isRole(x.role) &&
    typeof x.content === "string"
  );
}

function isChatRequestBody(x: unknown): x is ChatRequestBody {
  return (
    isObject(x) &&
    Array.isArray(x.messages) &&
    x.messages.every(isChatMessage)
  );
}

function extractMessageFromUnknown(u: unknown): string | undefined {
  if (typeof u === "string") return u;
  if (!isObject(u)) return undefined;

  if (typeof u.message === "string") return u.message as string;
  if (typeof u.reply === "string") return u.reply as string;
  if (typeof u.text === "string") return u.text as string;

  // OpenAI-like
  const choices = u.choices;
  if (Array.isArray(choices) && choices.length > 0) {
    const first = choices[0];
    if (
      isObject(first) &&
      isObject(first.message) &&
      typeof first.message.content === "string"
    ) {
      return first.message.content as string;
    }
  }
  return undefined;
}

export async function POST(req: Request) {
  const CHAT_API_URL = process.env.CHAT_API_URL;
  const CHAT_API_KEY = process.env.CHAT_API_KEY; // optional

  if (!CHAT_API_URL) {
    return NextResponse.json(
      { error: "CHAT_API_URL is not set on the server" },
      { status: 500 }
    );
  }

  let bodyUnknown: unknown;
  try {
    bodyUnknown = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isChatRequestBody(bodyUnknown)) {
    return NextResponse.json(
      { error: "Body shape invalid. Expected { messages: {role, content}[] }" },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(CHAT_API_KEY ? { authorization: `Bearer ${CHAT_API_KEY}` } : {}),
      },
      body: JSON.stringify(bodyUnknown),
    });

    const raw = await upstream.text();

    let message: string | undefined;
    try {
      const parsed: unknown = JSON.parse(raw);
      message = extractMessageFromUnknown(parsed);
      if (message === undefined) {
        // If unknown shape, return compacted JSON
        message = typeof parsed === "string" ? parsed : JSON.stringify(parsed);
      }
    } catch {
      // Non-JSON response
      message = raw;
    }

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream error ${upstream.status}`, message },
        { status: upstream.status }
      );
    }

    return NextResponse.json({ message });
  } catch (e: unknown) {
    const detail = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Failed to reach CHAT_API_URL", detail },
      { status: 502 }
    );
  }
}
