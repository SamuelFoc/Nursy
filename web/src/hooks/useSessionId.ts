import { useEffect, useState } from "react";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function useSessionId() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Prefer cookie; fallback to sessionStorage
    let id = getCookie("iqs_session_id");
    if (!id && typeof window !== "undefined") {
      id = window.sessionStorage.getItem("iqs_session_id");
    }
    if (id) setSessionId(id);
  }, []);

  return sessionId;
}

export default useSessionId;
