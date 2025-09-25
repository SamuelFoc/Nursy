"use client";

import { ParticipantSiteLayout } from "@/components/general/layouts/ParticipantSiteLayout";
import Section from "@/components/general/layouts/Section";
import Navigator from "@/components/general/Navigator";
import QueueGrid from "@/components/queue/QueueGrid";
import { type PublicQueue, PublicQueueSchema } from "@/types/schema";
import { useEffect, useState } from "react";

export default function QueuePage() {
  const [queue, setQueue] = useState<PublicQueue | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/queue`, { method: "GET" });
        const data = await res.json();
        const parsed = PublicQueueSchema.parse(data);
        setQueue(parsed);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <ParticipantSiteLayout>
      <Section>
        <Navigator title="Queue" />
      </Section>
      <Section>
        <QueueGrid queue={queue} />
      </Section>
    </ParticipantSiteLayout>
  );
}
