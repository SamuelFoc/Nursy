import { Participant } from "@/types/schema";

export function ParticipantRow({ participant }: { participant: Participant }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-neutral-800/40 transition-colors">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-mono tracking-tight">
          {participant.session_id.slice(0, 8)}…
        </span>
        <span className="text-base font-medium text-gray-100">
          <strong>Participant: </strong>
          {participant.seq}
        </span>
      </div>

      <div className="flex gap-8 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-400">Chat</span>
          <span className="text-gray-200">
            {JSON.stringify(participant?.chat) ?? (
              <span className="italic text-gray-600">None</span>
            )}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-400">Agent</span>
          <span className="text-gray-200">
            {participant.agent_id ?? (
              <span className="italic text-gray-600">None</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
