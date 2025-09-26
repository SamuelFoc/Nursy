import { Participant, ParticipantSchema } from "@/types/schema";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useParticipant() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/queue/participant/${sessionId}`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();
        const parsed = ParticipantSchema.parse(data);
        if (!cancelled) setParticipant(parsed);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return { participant, loading, error };
}
