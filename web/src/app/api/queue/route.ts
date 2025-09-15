const BASE = process.env.CHAT_API_URL


export async function GET(_req: Request) {
  try {
    const res = await fetch(`${BASE}/api/queue/`, {
      method: "GET",
    });
    const data = await res.json();

    return Response.json(data, {status: res.status});
  } catch (err) {
    console.error("Proxy error:", err);
    return Response.json({message: 'Bad Gateway'}, { status:  502})
  }
}
