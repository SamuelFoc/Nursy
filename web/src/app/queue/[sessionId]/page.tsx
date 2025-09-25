"use client";
import AssistantPrepCard from "@/components/chat/AssistantPrepCard";
import { ParticipantSiteLayout } from "@/components/general/layouts/ParticipantSiteLayout";
import Section from "@/components/general/layouts/Section";
import Navigator from "@/components/general/Navigator";
import { PersonalTicketCard } from "@/components/queue/personal/PersonalTicketCard";
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
    <ParticipantSiteLayout>
      <Section>
        <Navigator title="Home" />
      </Section>
      <Section>
        <PersonalTicketCard seq={participant?.seq ?? null} />
      </Section>
      <Section>
        <AssistantPrepCard />
      </Section>
    </ParticipantSiteLayout>
  );
}
