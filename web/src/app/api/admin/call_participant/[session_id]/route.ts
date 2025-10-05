const BASE = process.env.CHAT_API_URL

export async function POST(
    req: Request,
    { params }: { params: { session_id: string } }
) {
    try {
        const { session_id } = params
        if (!session_id) {
            return Response.json({ message: "session_id required" }, { status: 400 })
        }

        const res = await fetch(`${BASE}/api/queue/call/${encodeURIComponent(session_id)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })

        const data = await res.json()
        return Response.json(data, { status: res.status })
    } catch (err) {
        console.error("Proxy error:", err)
        return Response.json({ message: "Bad Gateway" }, { status: 502 })
    }
}