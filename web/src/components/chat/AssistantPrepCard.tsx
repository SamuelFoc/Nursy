import useSessionId from "@/hooks/useSessionId";

export default function AssistantPrepCard() {
  const sessionId = useSessionId();

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center space-y-6">
        <h2 className="text-2xl font-semibold text-white">Get ready now</h2>

        <p className="text-gray-300 text-base">
          Our virtual assistant will ask you a few simple questions to prepare a
          summary for the interviewer. This makes your turn faster and smoother.
        </p>

        {/* CTA */}
        <a
          href={`/chat/${sessionId}`}
          className="inline-flex items-center justify-center px-16 py-3 rounded-xl bg-white border border-white/20 text-black font-bold text-lg shadow-md hover:bg-white/90 hover:shadow-lg transition-all"
        >
          Start Chat
        </a>

        <p className="text-sm text-gray-400 max-w-xs">
          No personal details needed — your answers are anonymous and never
          stored or shared.
        </p>
      </div>
    </div>
  );
}
