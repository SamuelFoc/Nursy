// app/api/chat/init/route.ts
import type { Chat } from "@/types/chat";
import { NextResponse } from "next/server";

export async function POST() {
  const BASE = process.env.CHAT_API_URL;

  if (!BASE) {
    console.error("[chat/init] Missing CHAT_API_URL");
    return NextResponse.json(
      { error: "CHAT_API_URL is not set" },
      { status: 500 }
    );
  }

  const url = `${BASE.replace(/\/+$/, "")}/chat`;
  console.log("[chat/init] Requesting:", url);

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
    });

    console.log("[chat/init] Upstream status:", upstream.status, upstream.statusText);

    const text = await upstream.text();
    console.log("[chat/init] Upstream raw response:", text);

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream ${upstream.status}`, detail: text },
        { status: upstream.status }
      );
    }

    let data: Chat;
    try {
      data = JSON.parse(text) as Chat;
    } catch (e) {
      console.error("[chat/init] Failed to parse JSON:", e);
      return NextResponse.json(
        { error: "Invalid JSON response", detail: text },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("[chat/init] Fetch threw error:", e);
    const detail = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Upstream fetch failed", detail },
      { status: 502 }
    );
  }
}
