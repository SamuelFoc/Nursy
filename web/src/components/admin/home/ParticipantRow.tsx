import { Participant } from "@/types/schema";
import { useState } from "react";

export function ParticipantRow({ participant }: { participant: Participant }) {
  const [open, setOpen] = useState(false);

  const anamnesisEntries = Object.entries(
    participant.agent_anamnesis || {}
  ).filter(
    ([, value]) => value !== null && value !== undefined && value !== ""
  );

  const formatKey = (key: string) => key.charAt(0).toUpperCase() + key.slice(1);

  return (
    <div
      className="flex flex-col px-6 py-4 hover:bg-neutral-800/40 transition-colors cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-col">
          <span className="text-xs text-gray-500 font-mono tracking-tight">
            {participant.session_id.slice(0, 8)}…
          </span>
          <span className="text-base font-medium text-gray-100">
            <strong>Participant: </strong>
            {participant.seq}
          </span>
        </div>

        <div className="flex-2 flex gap-8 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-400">Flag</span>
            <span className="text-gray-200">
              {participant?.agent_flag === "<MINOR>" ? (
                <strong className="italic text-yellow-200">MINOR</strong>
              ) : participant.agent_flag === "<URGENT>" ? (
                <strong className="italic text-red-200">URGENT</strong>
              ) : (
                <strong className="italic text-gray-400">NONE</strong>
              )}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">Problem</span>
            <span className="text-gray-200">
              {participant.agent_diagnosis ? (
                <span className="italic text-gray-200">
                  {participant.agent_diagnosis.slice(0, 50)}...
                </span>
              ) : (
                <span className="italic text-gray-200">
                  Not discussed with virtual assistant yet...
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Section */}
      {open && (
        <div className="mt-4 border-t border-neutral-700 pt-4 space-y-2 text-sm text-gray-200">
          {anamnesisEntries.length > 0 ? (
            anamnesisEntries.map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <strong className="text-gray-400">{formatKey(key)}:</strong>
                <span className="text-gray-200">{String(value)}</span>
              </div>
            ))
          ) : (
            <span className="italic text-gray-500">No anamnesis data</span>
          )}
          {participant?.agent_diagnosis && (
            <div className="flex flex-col justify-between mt-8">
              <strong className="text-gray-400">Suggested Diagnosis:</strong>
              <span className="text-gray-200">
                {participant?.agent_diagnosis}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
