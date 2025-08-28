"use client";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export function JoinQueueButton() {
  const router = useRouter();

  const handleClick = () => {
    const sessionId = uuidv4(); // generates a random unique ID
    router.push(`/queue/${sessionId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-6 py-4 text-lg font-semibold text-slate-950 shadow-md hover:cursor-pointer hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900"
    >
      Join the Queue
    </button>
  );
}