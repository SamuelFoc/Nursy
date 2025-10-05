import { Participant } from "@/types/schema";
import AnamnesisEntry from "./AnamnesisEntry";

export default function ParticipantDetails({
  participant,
}: {
  participant: Participant;
}) {
  const anamnesisEntries = Object.entries(
    participant.agent_anamnesis || {}
  ).filter(
    ([, value]) => value !== null && value !== undefined && value !== ""
  );

  const formatKey = (key: string) => key.charAt(0).toUpperCase() + key.slice(1);

  return (
    <div className="mt-4 border-t border-neutral-700 pt-4 space-y-2 text-sm text-gray-200">
      {anamnesisEntries.length > 0 ? (
        anamnesisEntries.map(([key, value]) => (
          <AnamnesisEntry
            key={key}
            label={formatKey(key)}
            value={String(value)}
          />
        ))
      ) : (
        <span className="italic text-gray-500">No anamnesis data</span>
      )}

      {participant?.agent_diagnosis && (
        <div className="flex flex-col justify-between mt-8">
          <strong className="text-gray-400">Suggested Diagnosis:</strong>
          <span className="text-gray-200">{participant.agent_diagnosis}</span>
        </div>
      )}
    </div>
  );
}
