import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure streaming works in Node runtime

type ChatRequest = { content: string };

export async function POST(
  req: Request,
  ctx: { params: Promise<{ conversationId: string }> }
) {
  const BASE = process.env.CHAT_API_URL;
  if (!BASE) {
    return NextResponse.json(
      { error: "CHAT_API_URL is not set" },
      { status: 500 }
    );
  }

  // ❗️In Next.js (App Router) dynamic route handlers, params can be a Promise.
  const { conversationId } = await ctx.params;

  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
    console.log(body)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (typeof body.content !== "string" || body.content.trim() === "") {
    return NextResponse.json(
      { error: "Body must include non-empty 'content' string" },
      { status: 400 }
    );
  }

  const upstreamUrl = `${BASE.replace(/\/+$/, "")}/chat/${encodeURIComponent(
    conversationId
  )}`;

  const upstream = await fetch(upstreamUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    // Backend expects { message: string } (align with FastAPI handler)
    body: JSON.stringify({ message: body.content }),
    // Allow client aborts to cancel the upstream fetch
    signal: (req as any).signal,
  });

  // On error, return JSON; on success, **pipe** the SSE/body through.
  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return NextResponse.json(
      { error: `Upstream ${upstream.status || 502}`, detail: text || "No body" },
      { status: upstream.status || 502 }
    );
  }

  // Force correct SSE headers (compatible with plain text streams, too)
  const headers = new Headers();
  headers.set("content-type", "text/event-stream");
  headers.set("cache-control", "no-cache");
  headers.set("connection", "keep-alive");

  return new Response(upstream.body, { status: 200, headers });
}
