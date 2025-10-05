export default function ParticipantProblem({
  diagnosis,
}: {
  diagnosis?: string | null | undefined;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-400">Problem</span>
      <span className="text-gray-200 italic">
        {diagnosis
          ? `${diagnosis.slice(0, 50)}...`
          : "Not discussed with virtual assistant yet..."}
      </span>
    </div>
  );
}
