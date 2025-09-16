const BASE = process.env.CHAT_API_URL


export async function POST(req: Request ) {
    const body = await req.json()
    
    try {
        const res = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        });
        const data = await res.json();

        return Response.json(data, {status: res.status});
    } catch (err) {
        console.error("Proxy error:", err);
        return Response.json({message: 'Bad Gateway'}, { status:  502})
    }
}