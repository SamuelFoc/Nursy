"use client";
import { JoinQueueButton } from "@/components/buttons/JoinQueueButton";
import { BasicSiteLayout } from "@/components/general/layouts/BasicSiteLayout";
import useSessionId from "@/hooks/useSessionId";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function QueueLanding() {
  const router = useRouter();
  const sessionId = useSessionId();

  useEffect(() => {
    if (sessionId) {
      router.push(`/queue/${sessionId}`);
    }
  }, [sessionId, router]);

  return (
    <BasicSiteLayout>
      <div className="flex flex-col items-center justify-center flex-grow space-y-8">
        <h1 className="text-xl tracking-widest font-light text-gray-300">
          Intelligent Queue System
        </h1>
        <JoinQueueButton>Join Queue</JoinQueueButton>
        <p className="text-xs text-gray-500 tracking-wide">
          Do not waste your time in queue
        </p>
      </div>
    </BasicSiteLayout>
  );
}
