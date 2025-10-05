"use client";
import AssistantPrepCard from "@/components/chat/AssistantPrepCard";
import { BasicSiteLayout } from "@/components/general/layouts/BasicSiteLayout";
import Section from "@/components/general/layouts/Section";
import Navigator from "@/components/general/Navigator";
import Caller from "@/components/queue/personal/Caller";
import { PersonalTicketCard } from "@/components/queue/personal/PersonalTicketCard";
import { useParticipant } from "@/hooks/useParticipant";

export default function QueuePage() {
  const { participant } = useParticipant();
  console.log(participant);
  return (
    <BasicSiteLayout>
      <Section>
        <Navigator title="Home" />
      </Section>
      <Section>
        <PersonalTicketCard seq={participant?.seq ?? null} />
      </Section>
      {participant?.called && (
        <Section>
          <Caller>Its Your Turn</Caller>
        </Section>
      )}
      <Section>
        <AssistantPrepCard />
      </Section>
    </BasicSiteLayout>
  );
}
