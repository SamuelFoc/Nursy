// app/queue/[sessionId]/StatusSection.tsx
"use client";

import RedirectButton from "@/components/buttons/RedirectButton";
import { MinimalFooter } from "@/components/general/MinimalFooter";
import { SystemBadges } from "@/components/general/SystemBadges";
import { Participant } from "@/types/schema";
import { ChatHistory } from "./ChatHistory";
import { PersonalTicketCard } from "./PersonalTicketCard";
import { StatusHeader } from "./StatusHeader";

type StatusSectionProps = {
  sessionId: string | number;
  participant?: Participant | null;
};

export default function StatusSection({
  sessionId,
  participant,
}: StatusSectionProps) {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="max-w-2xl">
          <StatusHeader sessionId={sessionId} />

          <div className="h-60 mt-18 sm:mt-20">
            <PersonalTicketCard seq={participant?.seq ?? null} />
          </div>

          <div className="fixed sm:static bottom-20 left-0 w-full bg-black/80 backdrop-blur-sm border-t border-b sm:border-0 border-white/14 px-4 pt-8 sm:py-6">
            <div className="flex justify-around items-center">
              <RedirectButton href="/chat">Consultation</RedirectButton>
              <RedirectButton href="/queue">See the Queue</RedirectButton>
            </div>
            <SystemBadges />
            <MinimalFooter />
          </div>

          {participant?.agent_id && (
            <p className="mt-4 text-slate-400 text-sm">
              Handling agent:{" "}
              <span className="font-mono">{participant.agent_id}</span>
            </p>
          )}

          <ChatHistory history={participant?.chat?.history} />
        </div>
      </div>
    </section>
  );
}
