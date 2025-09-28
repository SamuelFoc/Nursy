"use client";

import { Participant } from "@/types/schema";
import { ParticipantRow } from "./ParticipantRow";

type ParticipantsListProps = {
  participants: Participant[];
};

export function ParticipantsList({ participants }: ParticipantsListProps) {
  return (
    <main className="flex flex-col gap-8 max-w-3xl w-full mx-auto p-6">
      <div className="overflow-hidden rounded-2xl bg-neutral-900 shadow-sm divide-y divide-neutral-800">
        {participants
          .sort((a, b) => a.seq - b.seq)
          .map((p) => (
            <ParticipantRow key={p.session_id} participant={p} />
          ))}
      </div>
    </main>
  );
}
