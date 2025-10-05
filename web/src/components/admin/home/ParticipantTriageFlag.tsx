export default function ParticipantTriageFlag({
  flag,
}: {
  flag?: string | undefined | null;
}) {
  let content;
  switch (flag) {
    case "<MINOR>":
      content = <strong className="italic text-yellow-200">MINOR</strong>;
      break;
    case "<URGENT>":
      content = <strong className="italic text-red-200">URGENT</strong>;
      break;
    default:
      content = <strong className="italic text-gray-400">NONE</strong>;
  }
  return (
    <div className="flex flex-col">
      <span className="text-gray-400">Flag</span>
      <span className="text-gray-200">{content}</span>
    </div>
  );
}
