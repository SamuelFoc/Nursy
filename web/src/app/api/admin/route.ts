const BASE = process.env.CHAT_API_URL


export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  try {
    const res = await fetch(`${BASE}/api/admin/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });
    const data = await res.json();

    return Response.json(data, {status: res.status});
  } catch (err) {
    console.error("Proxy error:", err);
    return Response.json({message: 'Bad Gateway'}, { status:  502})
  }
}
