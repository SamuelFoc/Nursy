import { JoinQueueButton } from "@/components/buttons/JoinQueueButton";

export default function QueueLanding() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-black text-white font-sans">
      <main className="flex flex-col items-center justify-center flex-grow space-y-8">
        <h1 className="text-2xl tracking-widest font-light text-gray-300">
          Intelligent Queue System
        </h1>
        <JoinQueueButton>Join Queue</JoinQueueButton>
        <p className="text-xs text-gray-500 tracking-wide">
          Do not waste your time in queue
        </p>
      </main>
      <footer className="py-4 text-xs text-gray-600 tracking-wide">
        © IQS – Intelligent Queue Systems
      </footer>
    </div>
  );
}
