import { JoinQueueButton } from "@/components/buttons/JoinQueueButton";
import { ParticipantSiteLayout } from "@/components/general/layouts/ParticipantSiteLayout";

export default function QueueLanding() {
  return (
    <ParticipantSiteLayout>
      <div className="flex flex-col items-center justify-center flex-grow space-y-8">
        <h1 className="text-2xl tracking-widest font-light text-gray-300">
          Intelligent Queue System
        </h1>
        <JoinQueueButton>Join Queue</JoinQueueButton>
        <p className="text-xs text-gray-500 tracking-wide">
          Do not waste your time in queue
        </p>
      </div>
    </ParticipantSiteLayout>
  );
}
