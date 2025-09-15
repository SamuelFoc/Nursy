import { Params } from "@/types/primitive";

const BASE = process.env.CHAT_API_URL;


export async function POST(_req: Request, { params }: Params ) {
  const { sessionId } = await params;

  try {
    const res = await fetch(`${BASE}/api/chat/init/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return Response.json(data, {status: res.status});
  } catch (err) {
    console.error("Proxy error:", err);
    return Response.json({message: 'Bad Gateway'}, { status:  502})
  }
}
