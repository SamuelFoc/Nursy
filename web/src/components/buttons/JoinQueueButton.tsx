"use client";
import useSessionId from "@/hooks/useSessionId";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

const COOKIE_NAME = "iqs_session_id";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

type Props = {
  children: ReactNode;
};

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  const isSecure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${
    isSecure ? "; Secure" : ""
  }`;
}

export function JoinQueueButton({ children }: Props) {
  const router = useRouter();
  const sessionId = useSessionId();

  const handleClick = async () => {
    const id = sessionId ?? uuidv4();

    if (!sessionId) {
      setCookie(COOKIE_NAME, id, COOKIE_MAX_AGE_SECONDS);
    }

    try {
      const res = await fetch(`/api/queue/register/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
    } catch (err) {
      console.error("Failed to register in queue", err);
      return;
    }

    router.push(`/queue/${id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="relative inline-flex items-center justify-center px-8 py-3 
                 rounded-full border border-white text-white font-medium tracking-wide
                 transition-all duration-300 ease-out
                 hover:bg-white hover:text-black
                 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
    >
      {children}
    </button>
  );
}
