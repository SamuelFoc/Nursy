"use client";
import React, { useState } from "react";


export function Composer({ onSend }: { onSend: (text: string) => void }) {
const [value, setValue] = useState("");


function handleSend() {
if (!value.trim()) return;
onSend(value);
setValue("");
}


return (
<div className="flex gap-2">
<input
className="flex-1 border rounded px-2 py-2 text-sm"
placeholder="Type your message…"
value={value}
onChange={(e) => setValue(e.target.value)}
onKeyDown={(e) => {
if (e.key === "Enter") handleSend();
}}
/>
<button
onClick={handleSend}
className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
>
Send
</button>
</div>
);
}