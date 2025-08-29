type ChatMessage = { role: string; content: string };
type ChatHistoryProps = { history?: ChatMessage[] };

export function ChatHistory({ history }: ChatHistoryProps) {
  if (!history?.length) return null;
  return (
    <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <h2 className="mb-2 text-sm font-semibold text-slate-200">Chat</h2>
      <ul className="max-h-64 space-y-2 overflow-y-auto text-sm text-slate-300">
        {history.map((msg, i) => (
          <li key={i}>
            <span className="font-semibold">{msg.role}:</span> {msg.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
