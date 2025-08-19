"use client";


export function ShieldIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4z" />
      <path d="M9.5 12.5l1.7 1.7 3.3-3.4" />
    </svg>
  );
}

export function ChatIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 6h16v9a3 3 0 0 1-3 3H9l-5 4V6z" />
    </svg>
  );
}

export function ClipboardIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="7" y="4" width="10" height="16" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}

export function SparkIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2l1.8 4.6L18 8l-4.2 1.4L12 14l-1.8-4.6L6 8l4.2-1.4L12 2z" />
      <path d="M5 20l1-2 2-1-2-1-1-2-1 2-2 1 2 1 1 2z" />
    </svg>
  );
}

export function HeartbeatIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4.5 12.5h3l2-4 3 8 2-4h5" />
      <path d="M20.5 8.5a5.5 5.5 0 0 0-9.5-3.9 5.5 5.5 0 0 0-9.5 3.9c0 6.1 9.5 11 9.5 11s9.5-4.9 9.5-11z" />
    </svg>
  );
}
