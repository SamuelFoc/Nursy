export default function AnamnesisEntry({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between">
      <strong className="text-gray-400">{label}:</strong>
      <span className="text-gray-200">{value}</span>
    </div>
  );
}
