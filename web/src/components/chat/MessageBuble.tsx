"use client";
import { Message } from "@/types/chat";
import React from "react";


export function MessageBubble({ message }: { message: Message }) {
const isAssistant = message.role === "assistant";
return (
<div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
<div
className={`rounded-md px-3 py-2 text-sm max-w-[80%] whitespace-pre-wrap ${
isAssistant ? "bg-blue-100 text-gray-900" : "bg-green-100 text-gray-900"
}`}
>
{message.content}
</div>
</div>
);
}