import { Participant } from "@/types/schema";
import ParticipantAdminComunicator from "./ParticipantAdminComunicator";
import ParticipantProblem from "./ParticipantProblem";
import ParticipantTriageFlag from "./ParticipantTriageFlag";

export default function ParticipantHeader({
  participant,
}: {
  participant: Participant;
}) {
  return (
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
        <ParticipantTriageFlag flag={participant.agent_flag} />
        <ParticipantProblem diagnosis={participant.agent_diagnosis} />
      </div>

      <div>
        <ParticipantAdminComunicator sessionId={participant?.session_id} />
      </div>
    </div>
  );
}
