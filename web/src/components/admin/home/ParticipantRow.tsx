import { Participant } from "@/types/schema";
import { useState } from "react";
import ParticipantDetails from "./ParticipantDetails";
import ParticipantHeader from "./ParticipantHeader";

export function ParticipantRow({ participant }: { participant: Participant }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative flex flex-col px-6 py-4 hover:bg-neutral-800/40 transition-colors cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <ParticipantHeader participant={participant} />
      {open && <ParticipantDetails participant={participant} />}
    </div>
  );
}
