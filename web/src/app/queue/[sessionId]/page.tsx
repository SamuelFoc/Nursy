"use client";
import StatusSection from "@/components/queue/personal/StatusSection";
import { ParticipantSchema, type Participant } from "@/types/schema";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function QueuePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [participant, setParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      try {
        const res = await fetch(`/api/queue/register/${sessionId}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
        });
        const data = await res.json();
        const parsed_participant = ParticipantSchema.parse(data);
        setParticipant(parsed_participant);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <StatusSection sessionId={sessionId} participant={participant} />
    </div>
  );
}
