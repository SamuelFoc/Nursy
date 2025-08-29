"use client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

const COOKIE_NAME = "iqs_session_id";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

type Props = {
  children: ReactNode;
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

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

  const handleClick = () => {
    // 1) Try cookie
    let sessionId = getCookie(COOKIE_NAME);

    // 2) Fallback: sessionStorage (per-tab)
    if (!sessionId && typeof window !== "undefined") {
      sessionId = window.sessionStorage.getItem(COOKIE_NAME) || null;
    }

    // 3) Create if missing
    if (!sessionId) {
      sessionId = uuidv4();
      setCookie(COOKIE_NAME, sessionId, COOKIE_MAX_AGE_SECONDS);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(COOKIE_NAME, sessionId);
      }
    }

    router.push(`/queue/${sessionId}`);
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
