import { Params } from "@/types/primitive";
import { Chat } from "@/types/schema";


const BASE = process.env.CHAT_API_URL;


export async function POST(req: Request, { params }: Params ) {
  const { sessionId } = await params;

  const body = await req.json()

  try {
    const res = await fetch(`${BASE}/api/chat/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: body?.content }),
    });
    const data = await res.json() as Chat
    return Response.json(data, {status: res.status});
  } catch (err) {
    console.error("Proxy error:", err);
    return Response.json({message: 'Bad Gateway'}, { status:  502})
  }
}
