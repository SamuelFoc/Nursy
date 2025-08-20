import { Role } from "@/types/chat";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatRequest = { content: string };

type ApiResponse = {
  chat_id: string;
  history: { role: Role; content: string }[];
};

type ApiError = {
  detail: string;
  error?: string;
};

export async function POST(
  req: Request,
  ctx: { params: Promise<{ conversationId: string }> }
) {
  const BASE = process.env.CHAT_API_URL;
  if (!BASE) {
    return NextResponse.json({ error: "CHAT_API_URL is not set" }, { status: 500 });
  }

  const { conversationId } = await ctx.params;

  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const upstreamUrl = `${BASE.replace(/\/+$/, "")}/chat/${encodeURIComponent(conversationId)}`;

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ message: body.content }),
      signal: (req as any).signal,
    });
  } catch (err) {
    return NextResponse.json(
      { detail: "Failed to reach upstream", error: String(err) },
      { status: 502 }
    );
  }

  let payload: ApiResponse | ApiError;
  try {
    payload = (await upstream.json()) as ApiResponse | ApiError;
  } catch (err) {
    return NextResponse.json(
      { detail: "Invalid upstream response", error: String(err) },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(payload, { status: upstream.status });
  }

  return NextResponse.json(payload, { status: 200 });
}
