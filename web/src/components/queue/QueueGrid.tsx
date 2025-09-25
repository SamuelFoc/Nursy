import { PublicQueue } from "@/types/schema";
import { PublicTicketCard } from "./PublicTicketCard";

interface QueueGridProps {
  queue?: PublicQueue | null;
}

export default function QueueGrid({ queue }: QueueGridProps) {
  return (
    <div className="w-full mt-16 sm:mt-20 grid grid-cols-4 gap-6 sm:gap-8 sm:grid-cols-6 lg:grid-cols-6">
      {queue?.queue?.map((item, id) => (
        <PublicTicketCard key={id} seq={item} />
      ))}
    </div>
  );
}
