"use client";
import AssistantPrepCard from "@/components/chat/AssistantPrepCard";
import { BasicSiteLayout } from "@/components/general/layouts/BasicSiteLayout";
import Section from "@/components/general/layouts/Section";
import Navigator from "@/components/general/Navigator";
import { PersonalTicketCard } from "@/components/queue/personal/PersonalTicketCard";
import { useParticipant } from "@/hooks/useParticipant";

export default function QueuePage() {
  const { participant } = useParticipant();

  return (
    <BasicSiteLayout>
      <Section>
        <Navigator title="Home" />
      </Section>
      <Section>
        <PersonalTicketCard seq={participant?.seq ?? null} />
      </Section>
      <Section>
        <AssistantPrepCard />
      </Section>
    </BasicSiteLayout>
  );
}
